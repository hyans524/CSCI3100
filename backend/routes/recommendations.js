const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const Recommendation = require('../models/Recommendation');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { location, budget, duration, activities, userId, groupId } = req.body;

  // Validate preference fields
  if (!location || !budget || !duration || !Array.isArray(activities)) {
    return res.status(400).json({
      error: "Missing or invalid required fields: location, budget, duration, activities"
    });
  }

  try {
    const prompt = `Generate a ${duration}-day travel plan for a trip to ${location} with a ${budget} budget. The traveler enjoys these activities: ${activities.join(', ')}. Format: "Day X: Activity1, Activity2", one line per day.`;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 700,
    });

    const suggestionText = completion.choices[0].message.content;
    const suggestions = suggestionText.split('\n').filter(line => line.trim() !== ''); // turns into an array

    const newRecommendation = new Recommendation({
      user_id: userId || null,
      group_id: groupId || null,
      preferences: { location, budget, duration, activities },
      suggestions,
    });

    await newRecommendation.save();
    res.json(newRecommendation);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch AI recommendation',
      detail: err.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;