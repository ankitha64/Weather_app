const express = require("express");
const axios = require("axios");
const Threshold = require("../models/Threshold");
const createAlert = require("../utils/alertService");
const router = express.Router();

// Route to set or update thresholds
router.post("/set-threshold", async (req, res) => {
  const { city, temperatureThreshold, weatherCondition } = req.body;
  try {
    let threshold = await Threshold.findOne({ city });

    if (threshold) {
      threshold.temperatureThreshold = temperatureThreshold;
      threshold.weatherCondition = weatherCondition;
    } else {
      threshold = new Threshold({
        city,
        temperatureThreshold,
        weatherCondition,
      });
    }

    await threshold.save();
    res.json({ message: "Threshold set successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to set threshold." });
  }
});

// Fetch weather and check thresholds
router.post("/fetch-weather", async (req, res) => {
  const cities = [
    "Delhi",
    "Mumbai",
    "Chennai",
    "Bangalore",
    "Kolkata",
    "Hyderabad",
  ];
  const alerts = []; // Initialize an array to store alerts

  try {
    for (const city of cities) {
      const apiKey = process.env.OWM_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const { temp } = response.data.main;
      const weatherCondition = response.data.weather[0].main;

      const threshold = await Threshold.findOne({ city });

      if (
        threshold &&
        (temp > threshold.temperatureThreshold ||
          weatherCondition === threshold.weatherCondition)
      ) {
        // Use the createAlert function to generate alert objects
        const alert = createAlert(city, temp, weatherCondition);
        alerts.push(alert); // Store the alert message
      }
    }

    res.json({ message: "Weather data fetched successfully.", alerts }); // Return alerts
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

// Route to get current weather
router.get("/current-weather/:city", async (req, res) => {
  const { city } = req.params;
  try {
    const apiKey = process.env.OWM_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      weatherCondition: response.data.weather[0].main,
    };

    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching current weather:", error);
    res.status(500).json({ error: "Failed to fetch current weather." });
  }
});

// Route to get threshold for a specific city
router.get("/threshold/:city", async (req, res) => {
  const { city } = req.params;
  try {
    const threshold = await Threshold.findOne({ city });
    if (!threshold) {
      return res.status(404).json({ message: "Threshold not found." });
    }
    res.status(200).json(threshold);
  } catch (error) {
    console.error("Error fetching threshold:", error); // Log error for debugging
    res.status(500).json({ error: "Failed to fetch threshold." });
  }
});

module.exports = router;
