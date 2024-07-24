from flask import Flask, request, jsonify
import torch
from transformers import ViTForImageClassification, ViTImageProcessor, ViTConfig
from PIL import Image
import io
import os

app = Flask(__name__)

# 모델 및 프로세서 초기화
model_path = 'food_drink_classifier.pth'
model_name = "google/vit-base-patch16-224"
processor = ViTImageProcessor.from_pretrained(model_name)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 모델 로드 함수
def load_model(model_path):
    config = ViTConfig.from_pretrained(model_name)
    config.num_labels = 2
    model = ViTForImageClassification.from_pretrained(model_name, config=config, ignore_mismatched_sizes=True)
    model.load_state_dict(torch.load(model_path, map_location=device))
    return model

model = load_model(model_path)
model.to(device)
model.eval()

# 이미지 예측 함수
def predict_image(image, threshold=0.7):
    pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)

    with torch.no_grad():
        outputs = model(pixel_values=pixel_values)
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)
        max_prob, predicted_class_idx = torch.max(probabilities, dim=1)

        if max_prob.item() < threshold:
            return "Unknown", max_prob.item()
        else:
            predicted_class = "Food" if predicted_class_idx.item() == 0 else "Drink"
            return predicted_class, max_prob.item()

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    image = Image.open(io.BytesIO(image_file.read())).convert('RGB')

    predicted_class, confidence = predict_image(image)

    return jsonify({
        'predicted_class': predicted_class,
        'confidence': float(confidence)
    })

if __name__ == '__main__':
    app.run(debug=True)