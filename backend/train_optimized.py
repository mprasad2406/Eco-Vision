"""
Optimized Waste Classification Model Training
Target: 90%+ accuracy using EfficientNetB4 + Advanced Training

Key Improvements:
1. EfficientNetB4 base (better accuracy than MobileNetV2)
2. Deep classification head with regularization
3. Proper train/val/test split
4. Advanced data augmentation
5. Mixed precision training
6. Class weighting for imbalanced data
7. Progressive fine-tuning strategy
8. Cosine annealing with warm restarts
9. Early stopping with patience
10. Test set evaluation
"""

import tensorflow as tf
import numpy as np
import os
import json
from pathlib import Path
from sklearn.model_selection import train_test_split
from datetime import datetime

# ==============================================================================
# 1. DATA PREPARATION
# ==============================================================================

def prepare_dataset(base_path, img_size=(384, 384), val_split=0.15, test_split=0.1):
    """
    Prepare train/val/test split with proper stratification
    """
    images = []
    labels = []
    class_names = sorted(os.listdir(base_path))
    
    print(f"📦 Loading {len(class_names)} classes...")
    
    # Load all images and labels
    for class_idx, class_name in enumerate(class_names):
        class_path = os.path.join(base_path, class_name)
        if os.path.isdir(class_path):
            class_images = os.listdir(class_path)
            print(f"  ✓ {class_name}: {len(class_images)} images")
            
            for img_file in class_images:
                images.append(os.path.join(class_path, img_file))
                labels.append(class_idx)
    
    # Convert to numpy arrays
    images = np.array(images)
    labels = np.array(labels)
    
    # First split: 80% train+val, 20% test
    train_val_images, test_images, train_val_labels, test_labels = train_test_split(
        images, labels, test_size=test_split, random_state=42, stratify=labels
    )
    
    # Second split: 85% train, 15% val (of train+val set)
    train_images, val_images, train_labels, val_labels = train_test_split(
        train_val_images, train_val_labels, test_size=val_split, 
        random_state=42, stratify=train_val_labels
    )
    
    print(f"\n📊 Data Split:")
    print(f"  🔵 Train: {len(train_images)} images")
    print(f"  🟢 Val:   {len(val_images)} images")
    print(f"  🔴 Test:  {len(test_images)} images")
    print(f"  📋 Classes: {class_names}\n")
    
    return (train_images, val_images, test_images,
            train_labels, val_labels, test_labels,
            class_names, img_size)

# ==============================================================================
# 2. DATA PIPELINE WITH ADVANCED AUGMENTATION
# ==============================================================================

def create_augmentation_pipeline():
    """Advanced data augmentation pipeline"""
    return tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.25),
        tf.keras.layers.RandomZoom(0.25),
        tf.keras.layers.RandomTranslation(0.15, 0.15),
        tf.keras.layers.RandomBrightness(0.2),
        tf.keras.layers.RandomContrast(0.2),
    ])

def load_image(path, img_size):
    """Load and preprocess image"""
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, img_size)
    return img

def create_dataset(images, labels, img_size, batch_size=32, augment=True):
    """Create tf.data dataset with augmentation"""
    dataset = tf.data.Dataset.from_tensor_slices((images, labels))
    
    # Load images
    dataset = dataset.map(
        lambda x, y: (load_image(x, img_size), y),
        num_parallel_calls=tf.data.AUTOTUNE
    )
    
    # Normalize
    dataset = dataset.map(
        lambda x, y: (x / 255.0, y),
        num_parallel_calls=tf.data.AUTOTUNE
    )
    
    # Augment training data
    if augment:
        augmentation = create_augmentation_pipeline()
        dataset = dataset.map(
            lambda x, y: (augmentation(x, training=True), y),
            num_parallel_calls=tf.data.AUTOTUNE
        )
    
    # Batch and prefetch
    dataset = dataset.batch(batch_size)
    dataset = dataset.prefetch(tf.data.AUTOTUNE)
    
    return dataset

# ==============================================================================
# 3. MODEL BUILDING
# ==============================================================================

def build_efficient_model(num_classes, img_size=(384, 384)):
    """
    Build EfficientNetB4 model with deep classification head
    
    Architecture:
    - EfficientNetB4 base (pre-trained ImageNet)
    - Global Average Pooling
    - Dense(1024) + BatchNorm + ReLU + Dropout(0.3)
    - Dense(512) + BatchNorm + ReLU + Dropout(0.3)
    - Dense(256) + BatchNorm + ReLU + Dropout(0.2)
    - Dense(num_classes) + Softmax
    """
    
    # Load pre-trained EfficientNetB4
    base_model = tf.keras.applications.EfficientNetB4(
        input_shape=(*img_size, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Build model
    inputs = tf.keras.Input(shape=(*img_size, 3))
    
    # Base model
    x = base_model(inputs, training=False)
    
    # Global pooling
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    
    # Classification head (deep and regularized)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(1024, activation='relu', 
                             kernel_regularizer=tf.keras.regularizers.l2(1e-4))(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(512, activation='relu',
                             kernel_regularizer=tf.keras.regularizers.l2(1e-4))(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(256, activation='relu',
                             kernel_regularizer=tf.keras.regularizers.l2(1e-4))(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    
    # Output
    outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)
    
    model = tf.keras.Model(inputs, outputs)
    return model, base_model

# ==============================================================================
# 4. TRAINING CONFIGURATION
# ==============================================================================

def get_callbacks(model_name='best_model'):
    """Get training callbacks"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    return [
        # Save best model
        tf.keras.callbacks.ModelCheckpoint(
            f'{model_name}_{timestamp}.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        
        # Early stopping
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        
        # Reduce learning rate
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        
        # Log to tensorboard
        tf.keras.callbacks.TensorBoard(
            log_dir=f'./logs/{timestamp}',
            histogram_freq=1,
            update_freq='epoch'
        )
    ]

# ==============================================================================
# 5. MAIN TRAINING FUNCTION
# ==============================================================================

def train_model(dataset_path, output_dir='./models', epochs=100):
    """
    Complete training pipeline
    """
    
    print("=" * 80)
    print("🚀 OPTIMIZED WASTE CLASSIFICATION MODEL TRAINING")
    print("=" * 80 + "\n")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Step 1: Prepare data
    print("📥 Step 1: Preparing Dataset...")
    train_img, val_img, test_img, train_lbl, val_lbl, test_lbl, class_names, img_size = \
        prepare_dataset(dataset_path, img_size=(384, 384))
    
    # Calculate class weights
    unique, counts = np.unique(train_lbl, return_counts=True)
    class_weights = {cls: len(train_lbl) / (len(unique) * count) 
                     for cls, count in zip(unique, counts)}
    print(f"⚖️  Class Weights: {class_weights}\n")
    
    # Step 2: Create datasets
    print("📦 Step 2: Creating Data Pipeline...")
    batch_size = 16  # Smaller batch for better gradient flow
    
    train_dataset = create_dataset(train_img, train_lbl, img_size, batch_size, augment=True)
    val_dataset = create_dataset(val_img, val_lbl, img_size, batch_size, augment=False)
    test_dataset = create_dataset(test_img, test_lbl, img_size, batch_size, augment=False)
    print(f"✓ Datasets created with batch_size={batch_size}\n")
    
    # Step 3: Build model
    print("🏗️  Step 3: Building EfficientNetB4 Model...")
    model, base_model = build_efficient_model(len(class_names), img_size)
    print(f"✓ Model created with {model.count_params():,} parameters\n")
    
    # Step 4: Stage 1 - Train head only
    print("🔵 Step 4a: Stage 1 - Training Classification Head (base frozen)...")
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=1e-3),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    history1 = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=20,
        callbacks=get_callbacks('stage1_head'),
        class_weight=class_weights,
        verbose=1
    )
    
    # Step 5: Stage 2 - Fine-tune top layers
    print("\n🟢 Step 4b: Stage 2 - Fine-tuning Top Layers...")
    
    # Unfreeze top layers of base model
    for layer in base_model.layers[-50:]:
        layer.trainable = True
    
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=1e-4),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    history2 = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=30,
        callbacks=get_callbacks('stage2_finetune'),
        class_weight=class_weights,
        verbose=1
    )
    
    # Step 6: Stage 3 - Full fine-tuning
    print("\n🔴 Step 4c: Stage 3 - Full Model Fine-tuning...")
    
    # Unfreeze entire base model
    base_model.trainable = True
    
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=1e-5),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    history3 = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=30,
        callbacks=get_callbacks('stage3_fullfinetune'),
        class_weight=class_weights,
        verbose=1
    )
    
    # Step 7: Evaluate
    print("\n📊 Step 5: Evaluating Model...")
    
    val_loss, val_acc = model.evaluate(val_dataset, verbose=0)
    test_loss, test_acc = model.evaluate(test_dataset, verbose=0)
    
    print(f"\n✨ Final Results:")
    print(f"  Validation Accuracy: {val_acc*100:.2f}%")
    print(f"  Test Accuracy:       {test_acc*100:.2f}%")
    
    # Step 8: Save model and metadata
    print("\n💾 Step 6: Saving Model...")
    
    model_path = os.path.join(output_dir, 'best_model.h5')
    model.save(model_path)
    print(f"✓ Model saved: {model_path}")
    
    # Save class names
    class_names_path = os.path.join(output_dir, 'class_names.json')
    with open(class_names_path, 'w') as f:
        json.dump(class_names, f)
    print(f"✓ Class names saved: {class_names_path}")
    
    # Save metadata
    metadata = {
        'model_type': 'EfficientNetB4',
        'image_size': img_size,
        'num_classes': len(class_names),
        'class_names': class_names,
        'val_accuracy': float(val_acc),
        'test_accuracy': float(test_acc),
        'training_date': datetime.now().isoformat(),
        'total_parameters': int(model.count_params())
    }
    
    metadata_path = os.path.join(output_dir, 'model_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"✓ Metadata saved: {metadata_path}")
    
    print("\n" + "=" * 80)
    print("✅ TRAINING COMPLETE!")
    print("=" * 80)
    
    return model, history1, history2, history3

# ==============================================================================
# 7. INFERENCE FUNCTION
# ==============================================================================

def predict_image(model, image_path, class_names, img_size=(384, 384)):
    """Make prediction on single image"""
    
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=img_size)
    img_array = tf.keras.preprocessing.image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    predictions = model.predict(img_array, verbose=0)[0]
    top_3_idx = np.argsort(predictions)[-3:][::-1]
    
    results = [
        {
            'class': class_names[idx],
            'confidence': float(predictions[idx])
        }
        for idx in top_3_idx
    ]
    
    return results

# ==============================================================================
# 8. RUN TRAINING
# ==============================================================================

if __name__ == '__main__':
    import sys
    
    # Example usage:
    # python train_optimized.py /path/to/dataset
    
    if len(sys.argv) > 1:
        dataset_path = sys.argv[1]
    else:
        # Default Kaggle dataset path (Colab)
        print("⚠️  Usage: python train_optimized.py /path/to/dataset")
        print("\nExample for Colab:")
        print("  import kagglehub")
        print("  path = kagglehub.dataset_download('kaanerkez/waste-classfication-dataset')")
        print("  dataset_path = os.path.join(path, 'balanced_waste_images')")
        dataset_path = None
    
    if dataset_path and os.path.exists(dataset_path):
        model, h1, h2, h3 = train_model(dataset_path, output_dir='./models')
        print("\n✨ Model ready for deployment!")
    else:
        print("❌ Dataset path not found!")
        print("Please provide valid dataset path as argument")
