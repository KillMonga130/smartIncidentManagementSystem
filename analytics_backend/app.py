# analytics_backend/app.py

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

# Example model training - in real-world applications, you would load a pre-trained model
def train_model():
    # Dummy dataset
    data = {
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [5, 4, 3, 2, 1],
        'incident': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)

    X = df[['feature1', 'feature2']]
    y = df['incident']

    model = LogisticRegression()
    model.fit(X, y)

    return model

# Train the model (this is just an example, in production you'd load a pre-trained model)
model = train_model()

@app.route('/predict', methods=['POST'])
def predict_incident():
    data = request.get_json(force=True)
    features = np.array([data['feature1'], data['feature2']]).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)

#Explanation:

#train_model() Function: This function simulates training a logistic regression model. In a real-world scenario, you would load a pre-trained model from disk using a library like joblib.
#/predict Endpoint: This endpoint accepts JSON data, runs the data through the model, and returns a prediction.