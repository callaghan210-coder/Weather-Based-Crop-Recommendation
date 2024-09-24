import sys
import pickle
import pandas as pd

# Load the saved model
model = pickle.load(open('crop_recommendation_model.pkl', 'rb'))

# Take input from Node.js
n = float(sys.argv[1])
p = float(sys.argv[2])
k = float(sys.argv[3])
temperature = float(sys.argv[4])
humidity = float(sys.argv[5])
ph = float(sys.argv[6])
rainfall = float(sys.argv[7])

# Create a DataFrame for prediction
input_data = pd.DataFrame([[n, p, k, temperature, humidity, ph, rainfall]], 
                          columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])

# Make prediction
prediction = model.predict(input_data)

# Output the prediction result
print(prediction[0])
