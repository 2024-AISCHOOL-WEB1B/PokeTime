from flask import Flask, request, jsonify, make_response
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

ROBOFLOW_API_KEY = "95Plu68fpnn7EPLmkdj5"
ROBOFLOW_MODEL = "predictfood/1"

@app.route('/predict', methods=['OPTIONS'])
def handle_options_request():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

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
        resp = jsonify(result)
        resp.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        return resp
    else:
        return jsonify({'error': 'Failed to get prediction from Roboflow'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)