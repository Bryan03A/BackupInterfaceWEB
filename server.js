const express = require('express');
const path = require('path');
const axios = require('axios'); // To make HTTP requests
const cors = require('cors');

const app = express();
const port = 9090;

app.use(cors()); 

// Middleware to process JSON requests
app.use(express.json());  // This line was missing

// Configure the middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for the admin-chat.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-chat.html'));
});

// Route to backup chats, invoking the Flask microservice
app.post('/backup-chats', async (req, res) => {
  try {
    // Make a POST request to the Flask API
    const response = await axios.post('http://3.227.120.143:6001/copy_chats');
    
    // Send Flask's response to the client
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error contacting the Flask microservice:', error);
    res.status(500).json({ message: 'Error contacting the Flask microservice' });
  }
});

// Route to restore chats, invoking the Flask microservice
app.post('/restore-chats', async (req, res) => {
  try {
    const restoreDate = req.body.restore_date; // Restoration date provided by the user
    
    if (!restoreDate) {
      return res.status(400).json({ message: 'Please enter a valid restoration date.' });
    }
    
    // Make a POST request to the Flask microservice to restore the chats
    const response = await axios.post('http://3.227.120.143:6006/restore_chats', { restore_date: restoreDate });
    
    // Send Flask's response to the client
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error contacting the Flask microservice:', error);
    res.status(500).json({ message: 'Error contacting the Flask microservice' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server
app.listen(port, () => {
  console.log(`Chat management server running at http://54.166.118.216:${port}`);
});