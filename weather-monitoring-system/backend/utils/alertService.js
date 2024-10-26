function createAlert(city, temp, condition) {
  // Format the alert message for the front end
  return {
    city,
    temperature: temp,
    condition,
    message: `ALERT: ${city} has breached the threshold!`,
  };
}

// Export the createAlert function
module.exports = createAlert;
