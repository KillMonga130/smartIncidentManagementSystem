from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

app = Flask(__name__)

# Example model training
def train_model():
    data = {
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [5, 4, 3, 2, 1],
        'incident': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)
    X = df[['feature1', 'feature2']]
    y = df['incident']

    model = RandomForestClassifier()
    model.fit(X, y)

    joblib.dump(model, 'incident_predictor.pkl')
    return model

# Load or train the model
try:
    model = joblib.load('incident_predictor.pkl')
except FileNotFoundError:
    model = train_model()

@app.route('/predict', methods=['POST'])
def predict_incident():
    data = request.get_json(force=True)
    features = np.array([data['feature1'], data['feature2']]).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
