"""
Create pre-trained waste classification model using MobileNetV2 transfer learning
Run this once to generate waste_classifier_model.h5
"""

import tensorflow as tf
import numpy as np
import os
from pathlib import Path

def create_waste_model():
    """Create a MobileNetV2-based waste classification model"""
    
    # Class names matching the trained model
    CLASS_NAMES = [
        'Battery', 'Cardboard', 'Glass', 'Metal', 'Organic',
        'Paper', 'Plastic', 'Trash', 'Keyboard', 'Mobile',
        'Mouse', 'Printer', 'Television', 'Microwave', 'Washing Machine',
        'PCB', 'Player'
    ]
    
    # Build model
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False
    
    model = tf.keras.Sequential([
        tf.keras.layers.Rescaling(1./255),
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(512, activation='relu'),
        tf.keras.layers.Dropout(0.4),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(len(CLASS_NAMES), activation='softmax')
    ])
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Create models directory
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Save model
    model_path = os.path.join(models_dir, 'waste_classifier_model.h5')
    model.save(model_path)
    
    print(f"✓ Model created: {model_path}")
    print(f"✓ Input shape: (224, 224, 3)")
    print(f"✓ Output classes: {len(CLASS_NAMES)}")
    print(f"✓ Classes: {CLASS_NAMES}")
    
    return model_path

if __name__ == '__main__':
    print("Creating waste classification model...")
    model_path = create_waste_model()
    print(f"\n✓ Model ready at: {model_path}")
