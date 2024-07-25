from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORS 설정 추가

ROBOFLOW_API_KEY = "95Plu68fpnn7EPLmkdj5"
ROBOFLOW_MODEL = "predictfood/1"

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']

    # Roboflow API 호출
    url = f"https://classify.roboflow.com/{ROBOFLOW_MODEL}?api_key={ROBOFLOW_API_KEY}"

    # 파일을 multipart/form-data로 전송
    files = {'file': image}
    response = requests.post(url, files=files)

    if response.status_code == 200:
        result = response.json()
        return jsonify(result)
    else:
        return jsonify({'error': 'Failed to get prediction from Roboflow'}), 500

if __name__ == '__main__':
    app.run(debug=True)
