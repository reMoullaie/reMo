const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://BearCoin:0072007854692358hr@cluster0.aeoh2.mongodb.net/Bear?retryWrites=true&w=majority&appName=Cluster0', {
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  telegramId: String,
  points: Number,
  levelIndex: Number,
  clicks: [{ id: Number, x: Number, y: Number }],
  pointsToAdd: Number,
  clickLevel: Number,
  profitPerHour: Number
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/user', async (req, res) => {
  const { telegramId, points, levelIndex,  pointsToAdd, clickLevel, profitPerHour } = req.body;
  try {
    let user = await User.findOne({ telegramId });
    if (user) {
      user.points = points;
      user.levelIndex = levelIndex;
      user.pointsToAdd = pointsToAdd;
      user.clickLevel = clickLevel;
      user.profitPerHour = profitPerHour;
      user = await user.save();
    } else {
      user = new User({ telegramId, points, levelIndex, pointsToAdd, clickLevel, profitPerHour });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
