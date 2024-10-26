const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const weatherRoutes = require("./routes/weatherRoutes");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Make sure to parse JSON bodies

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/weather", weatherRoutes); // Ensure this line is correct

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
