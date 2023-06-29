// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Set up middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://aashishpokherel:ram123@cluster0.cgf81hu.mongodb.net/Cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a mongoose schema for the data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Create a mongoose model
const User = mongoose.model('ourteam', userSchema);

// Set the default API key
const apiKey = process.env.API_KEY || '123';

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  const apiKeyHeader = req.header('x-api-key');

  // Check if API key is present and valid
  if (apiKeyHeader && apiKeyHeader === apiKey) {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // Return unauthorized status if API key is missing or invalid
  }
};

// Define a controller to handle the API endpoint
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Apply API key authentication middleware to the '/users' route
app.post('/users', validateApiKey, createUser);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
