const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://db/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Function to insert sample data into MongoDB
const insertSampleData = async () => {
  const sampleData = [
    { name: 'John Doe', email: 'john@example-mail.com' },
    { name: 'Jane Smith', email: 'jane@example.com' }
    // Add more sample data as needed
  ];

  try {
    await User.insertMany(sampleData);
    console.log('Sample data inserted successfully');
  } catch (err) {
    console.error('Failed to insert sample data into MongoDB:', err);
  }
};

// Insert sample data when the application starts
insertSampleData();

// Create an Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
