import torch
from torch.utils.data import DataLoader
from transformers import ViTForImageClassification, ViTImageProcessor, ViTConfig
from PIL import Image
from tqdm import tqdm
from sklearn.metrics import accuracy_score, classification_report
import os


class FoodDrinkDataset(torch.utils.data.Dataset):
    def __init__(self, root_dir, processor):
        self.root_dir = root_dir
        self.processor = processor
        self.images = []
        self.labels = []

        for label, class_name in enumerate(['food', 'drink']):
            class_dir = os.path.join(root_dir, class_name)
            for img_name in os.listdir(class_dir):
                self.images.append(os.path.join(class_dir, img_name))
                self.labels.append(label)

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img_path = self.images[idx]
        image = Image.open(img_path).convert('RGB')
        pixel_values = self.processor(images=image, return_tensors="pt").pixel_values
        return pixel_values.squeeze(), self.labels[idx]


def load_model(model_path):
    model_name = "google/vit-base-patch16-224"
    config = ViTConfig.from_pretrained(model_name)
    config.num_labels = 2
    model = ViTForImageClassification.from_pretrained(model_name, config=config, ignore_mismatched_sizes=True)
    model.load_state_dict(torch.load(model_path))
    return model


def predict_image(image_path, model, processor, device, threshold=0.7):
    image = Image.open(image_path).convert('RGB')
    pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)

    model.eval()
    with torch.no_grad():
        outputs = model(pixel_values=pixel_values)
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)
        max_prob, predicted_class_idx = torch.max(probabilities, dim=1)

        if max_prob.item() < threshold:
            return "Unknown", max_prob.item()
        else:
            predicted_class = "Food" if predicted_class_idx.item() == 0 else "Drink"
            return predicted_class, max_prob.item()


def evaluate_test_set(model, test_loader, device, threshold=0.7):
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for batch in tqdm(test_loader, desc="Evaluating"):
            pixel_values, labels = batch
            pixel_values, labels = pixel_values.to(device), labels.to(device)

            outputs = model(pixel_values=pixel_values)
            probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)
            max_probs, preds = torch.max(probabilities, dim=1)

            # Apply threshold
            preds[max_probs < threshold] = 2  # 2 represents "Unknown"

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    accuracy = accuracy_score(all_labels,
                              [p for p in all_preds if p != 2])  # Exclude "Unknown" from accuracy calculation
    print(f"Test Accuracy (excluding Unknown): {accuracy:.4f}")
    print(classification_report(all_labels, all_preds, target_names=['Food', 'Drink', 'Unknown']))


if __name__ == "__main__":
    model_path = 'food_drink_classifier.pth'
    model_name = "google/vit-base-patch16-224"
    processor = ViTImageProcessor.from_pretrained(model_name)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = load_model(model_path)
    model.to(device)

    # 개별 이미지 예측
    test_image_path = "test_img/커피.jpg"
    predicted_class, confidence = predict_image(test_image_path, model, processor, device, threshold=0.7)
    print(f"Predicted class: {predicted_class}")
    print(f"Confidence: {confidence:.4f}")

    # 전체 테스트 셋 평가
    # test_dataset = FoodDrinkDataset('test', processor)
    # test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)
    # evaluate_test_set(model, test_loader, device, threshold=0.7)