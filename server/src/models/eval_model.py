import requests

# Roboflow API URL 및 API 키 설정
api_url = "https://api.roboflow.com/dataset/{dataset}/model/{model}/metrics"
api_key = "95Plu68fpnn7EPLmkdj5"

# API 호출
response = requests.get(api_url, headers={"Authorization": f"Bearer {api_key}"})

# 결과 확인
if response.status_code == 200:
    metrics = response.json()
    print("Metrics:", metrics)
else:
    print("Error:", response.status_code, response.text)
