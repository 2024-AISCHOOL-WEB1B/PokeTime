import torch
from torch.utils.data import DataLoader, Dataset
from transformers import ViTForImageClassification, ViTImageProcessor, ViTConfig
from PIL import Image
import os
from tqdm import tqdm
from sklearn.metrics import accuracy_score, classification_report

class FoodDrinkDataset(Dataset):
    def __init__(self, root_dir, processor, is_train=True):
        self.root_dir = root_dir
        self.processor = processor
        self.is_train = is_train
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

def train_and_evaluate_model():
    # 데이터 전처리 및 모델 설정
    model_name = "google/vit-base-patch16-224"
    processor = ViTImageProcessor.from_pretrained(model_name)

    # 모델 설정 및 로드
    config = ViTConfig.from_pretrained(model_name)
    config.num_labels = 2
    model = ViTForImageClassification.from_pretrained(model_name, config=config, ignore_mismatched_sizes=True)

    # 데이터셋 및 데이터로더 설정
    train_dataset = FoodDrinkDataset('train', processor, is_train=True)
    test_dataset = FoodDrinkDataset('test', processor, is_train=False)
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

    # 학습 설정
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)
    num_epochs = 10

    # 손실 함수 설정 (가중치 없음)
    criterion = torch.nn.CrossEntropyLoss()

    # 학습 루프
    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        for batch in tqdm(train_loader, desc=f"Epoch {epoch + 1}/{num_epochs}"):
            pixel_values, labels = batch
            pixel_values, labels = pixel_values.to(device), labels.to(device)

            outputs = model(pixel_values=pixel_values, labels=labels)
            loss = criterion(outputs.logits, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch + 1}/{num_epochs}, Loss: {total_loss / len(train_loader):.4f}")

    # 모델 저장
    torch.save(model.state_dict(), 'food_drink_classifier.pth')
    print("Model saved successfully.")

    # 평가
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for batch in tqdm(test_loader, desc="Evaluating"):
            pixel_values, labels = batch
            pixel_values, labels = pixel_values.to(device), labels.to(device)

            outputs = model(pixel_values=pixel_values)
            preds = torch.argmax(outputs.logits, dim=1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    # 결과 출력
    accuracy = accuracy_score(all_labels, all_preds)
    print(f"Test Accuracy: {accuracy:.4f}")
    print(classification_report(all_labels, all_preds, target_names=['Food', 'Drink']))

if __name__ == "__main__":
    train_and_evaluate_model()