# SmartIncidentManagementSystem
A comprehensive Smart Incident Management System with predictive analytics, resource optimization, and real-time features.


app.py: 

Explanation of the Code:
Training the Model:

The train_model() function creates a simple logistic regression model using dummy data. This function is just for demonstration, and in a real-world application, you'd likely train your model on a much larger dataset.
After training, the model is saved to a file (incident_predictor.pkl) using joblib.
Loading the Model:

The load_model() function attempts to load the model from the file. If the file does not exist, it trains the model and then saves it. This ensures that the model is available when the Flask app starts.
Predicting Incidents:

The /predict endpoint accepts a POST request with JSON data containing features (e.g., feature1, feature2). It then uses the loaded model to make a prediction and returns the prediction as a JSON response.
Running the Flask App:

The app is set to run in debug mode on the default Flask development server (http://127.0.0.1:5000).

