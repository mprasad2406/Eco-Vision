"""
Diagnostic Tool: Identify Model Performance Issues
Tests all categories to identify which ones are failing
"""

import tensorflow as tf
import numpy as np
from pathlib import Path
import json
from PIL import Image
import os

print("\n" + "="*80)
print("🔍 MODEL DIAGNOSTIC TOOL - Identify Failing Categories")
print("="*80 + "\n")

# Load model
model_path = Path(__file__).parent / 'best_model.h5'
class_names_path = Path(__file__).parent / 'class_names.json'

if not model_path.exists():
    print("❌ Model not found at:", model_path)
    exit(1)

print(f"📦 Loading model from: {model_path}")
model = tf.keras.models.load_model(str(model_path))

# Load class names
with open(class_names_path, 'r') as f:
    class_names = json.load(f)

print(f"📋 Classes: {class_names}")
print(f"✅ Model loaded successfully\n")

# Get model info
print(f"🏗️  Model Architecture:")
print(f"   Input shape: {model.input_shape}")
print(f"   Output shape: {model.output_shape}")
print(f"   Total parameters: {model.count_params():,}\n")

# Analyze layer types
print(f"📊 Layer Analysis:")
rescaling_found = False
for layer in model.layers:
    if 'Rescaling' in layer.__class__.__name__:
        rescaling_found = True
        print(f"   ✓ Found Rescaling layer: {layer}")
    if 'Dropout' in layer.__class__.__name__:
        print(f"   ✓ Dropout layer: {layer}")
    if 'Dense' in layer.__class__.__name__:
        print(f"   ✓ Dense layer: {layer.units} units")

print(f"\n✓ Rescaling layer present: {rescaling_found}\n")

# Test on sample images
test_images_dir = Path(__file__).parent / 'test_images'

print(f"📸 Testing on available test images:\n")
test_results = {}

if test_images_dir.exists():
    for img_file in sorted(test_images_dir.glob('*.jpg')):
        try:
            # Load image
            img = Image.open(img_file).convert('RGB')
            img = img.resize((224, 224))
            img_array = np.array(img).astype('float32')
            
            # Check if rescaling is needed
            if not rescaling_found:
                img_array = img_array / 255.0
            
            img_array = np.expand_dims(img_array, axis=0)
            
            # Predict
            predictions = model.predict(img_array, verbose=0)[0]
            top_3_idx = np.argsort(predictions)[::-1][:3]
            
            category = img_file.stem
            top_pred = class_names[top_3_idx[0]]
            confidence = predictions[top_3_idx[0]]
            
            print(f"📷 {img_file.name}")
            print(f"   Expected: {category}")
            print(f"   Predicted: {top_pred}")
            print(f"   Confidence: {confidence*100:.2f}%")
            print(f"   Top 3: {[(class_names[i], round(predictions[i]*100, 2)) for i in top_3_idx]}")
            
            is_correct = category.lower() in top_pred.lower() or top_pred.lower() in category.lower()
            print(f"   Status: {'✅ CORRECT' if is_correct else '❌ WRONG'}\n")
            
            test_results[category] = {
                'predicted': top_pred,
                'confidence': float(confidence),
                'correct': is_correct,
                'top_3': [(class_names[i], float(predictions[i])) for i in top_3_idx]
            }
            
        except Exception as e:
            print(f"❌ Error testing {img_file}: {e}\n")

# Summary
print("\n" + "="*80)
print("📊 SUMMARY")
print("="*80 + "\n")

correct = sum(1 for r in test_results.values() if r['correct'])
total = len(test_results)
accuracy = (correct / total * 100) if total > 0 else 0

print(f"✅ Correct: {correct}/{total} ({accuracy:.1f}%)")
print(f"❌ Failed:  {total - correct}/{total} ({100-accuracy:.1f}%)\n")

# Identify problematic categories
print("🚨 CATEGORY PERFORMANCE ANALYSIS:")
print("\nThe following categories mentioned as failing need improvement:\n")

failing_categories = ['Mobile', 'Washing Machine', 'Television', 'plastic', 'Keyboard', 'Printer', 'Microwave', 'PCB', 'Player']

print("Category Performance Priority:")
for cat in failing_categories:
    # Find matching class name
    matched = [c for c in class_names if cat.lower() in c.lower() or c.lower() in cat.lower()]
    if matched:
        matched_class = matched[0]
        print(f"  • {matched_class}: ⚠️  NEEDS IMPROVEMENT")
    else:
        print(f"  • {cat}: Not found in model")

print("\n" + "="*80)
print("🔧 RECOMMENDATIONS")
print("="*80 + "\n")

print("""
To improve accuracy on failing categories:

1. ✅ COLLECT MORE DATA
   - Mobile phones: Collect images of different phone models, brands, conditions
   - Washing Machines: Different sizes, colors, angles
   - Television: Various screen types, sizes, orientations
   - Plastic Bottles: Different colors, shapes, full/empty

2. ✅ IMPROVE DATA QUALITY
   - Use clear, well-lit images
   - Take photos from multiple angles (front, side, top)
   - Include different lighting conditions
   - Remove corrupted/blurry images

3. ✅ AUGMENTATION STRATEGY
   - Increase rotation range: 0.25 → 0.35
   - Increase zoom: 0.25 → 0.35
   - Add color jitter and saturation changes
   - Use MixUp or CutMix techniques

4. ✅ TRAINING IMPROVEMENTS
   - Use class weights to focus on weak categories
   - Train longer with early stopping patience=7
   - Use focal loss for imbalanced categories
   - Add more dense layers for better feature extraction

5. ✅ ARCHITECTURE CHANGES
   - Use EfficientNetB4 instead of MobileNetV2
   - Increase image size: 224 → 384
   - Deeper classification head: add more dense layers
   - Use ensemble of 2-3 models

6. ✅ REAL-WORLD TESTING
   - Test on actual phone/TV/washing machine images
   - Collect failure cases and retrain
   - Use test-time augmentation (TTA)
   - Implement user feedback loop

""")

# Save results
results_file = Path(__file__).parent / 'diagnostic_results.json'
with open(results_file, 'w') as f:
    json.dump({
        'total_test_images': total,
        'correct_predictions': correct,
        'accuracy_percentage': accuracy,
        'test_results': test_results,
        'model_shape': str(model.input_shape),
        'num_classes': len(class_names),
        'class_names': class_names
    }, f, indent=2)

print(f"💾 Results saved to: {results_file}\n")
