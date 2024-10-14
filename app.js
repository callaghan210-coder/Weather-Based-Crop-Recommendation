// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const { connectToDb, sql } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Use CORS middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database
connectToDb();

// Route to the home page
app.get('/', (req, res) => {
  res.send('Welcome to the Weather-based Crop Recommendation System');
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const request = new sql.Request();
    const result = await request.query(`SELECT * FROM Users WHERE username = '${username}' AND password = '${password}'`);

    if (result.recordset.length > 0) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    console.error('Error in login route', err);
    res.status(500).send('Server error');
  }
});

// Route to get crop recommendations
app.post('/recommendation', async (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

  console.log('Received POST request with data:', { N, P, K, temperature, humidity, ph, rainfall }); // Log the received data

  // Options to pass arguments to the Python script
  let options = {
    args: [N, P, K, temperature, humidity, ph, rainfall]
  };

  // Call the Python script that makes crop recommendations
  PythonShell.run('predict.py', options, function (err, results) {
    if (err) {
      console.error('Error running Python script:', err); // Log the error
      return res.status(500).send('Error processing your request.');
    }

    console.log('Python script executed successfully.'); // Log successful execution
    console.log('Python script output:', results); // Log the result

    if (!results || results.length === 0) {
      console.error('No prediction received from Python script.'); // Log if no output
      return res.status(500).send('No prediction received from Python script.');
    }

    // The result will be the predicted crop
    const recommendedCrop = results[0];  // Python script prints out the result

    console.log('Recommended Crop:', recommendedCrop); // Log the predicted crop

    // Send the prediction back as response
    res.status(200).send({
      message: 'Crop recommendation based on weather and soil data',
      recommendedCrop: recommendedCrop
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
