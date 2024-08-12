from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os
import requests
from datetime import datetime
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Example: Directory for models
MODEL_DIR = 'models'

# Function to load or train a model
def load_model(model_name='incident_predictor.pkl'):
    model_path = os.path.join(MODEL_DIR, model_name)
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        logging.info(f"Model {model_name} loaded successfully.")
    else:
        model = train_model()
    return model

# Function to train a new model
def train_model():
    # Dummy dataset for demonstration
    data = {
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [5, 4, 3, 2, 1],
        'incident': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)
    X = df[['feature1', 'feature2']]
    y = df['incident']

    # Train a pipeline with scaling and a Gradient Boosting model
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', GradientBoostingClassifier())
    ])
    pipeline.fit(X, y)

    # Save the model
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
    joblib.dump(pipeline, os.path.join(MODEL_DIR, 'incident_predictor.pkl'))
    
    logging.info("Model trained and saved successfully.")
    return pipeline

# Load the model
model = load_model()

# External API example: Weather data (e.g., OpenWeatherMap)
def fetch_weather_data(latitude, longitude):
    api_key = "your_api_key_here"
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        return {
            'temperature': weather_data['main']['temp'],
            'humidity': weather_data['main']['humidity'],
            'weather': weather_data['weather'][0]['description']
        }
    else:
        return None

@app.route('/predict', methods=['POST'])
def predict_incident():
    try:
        data = request.get_json(force=True)
        features = np.array([data['feature1'], data['feature2']]).reshape(1, -1)
        
        # Fetch external data if needed
        weather_data = fetch_weather_data(data['latitude'], data['longitude'])
        if weather_data:
            logging.info(f"Weather data: {weather_data}")

        prediction = model.predict(features)
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        logging.error(f"Error in /predict: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain_model():
    try:
        data = request.get_json(force=True)
        df = pd.DataFrame(data)
        X = df[['feature1', 'feature2']]
        y = df['incident']

        model = GradientBoostingClassifier()
        model.fit(X, y)

        joblib.dump(model, os.path.join(MODEL_DIR, 'incident_predictor.pkl'))
        logging.info("Model retrained successfully.")
        return jsonify({'message': 'Model retrained successfully'})
    except Exception as e:
        logging.error(f"Error in /retrain: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/log', methods=['POST'])
def log_prediction():
    try:
        data = request.get_json(force=True)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"{timestamp}, {data['latitude']}, {data['longitude']}, {data['prediction']}\n"
        
        with open('prediction_log.csv', 'a') as f:
            f.write(log_entry)
        
        logging.info("Prediction logged successfully.")
        return jsonify({'message': 'Prediction logged successfully'})
    except Exception as e:
        logging.error(f"Error in /log: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
