const mongoose = require("mongoose");

const thresholdSchema = new mongoose.Schema({
  city: String,
  temperatureThreshold: Number,
  weatherCondition: String,
});

module.exports = mongoose.model("Threshold", thresholdSchema);
