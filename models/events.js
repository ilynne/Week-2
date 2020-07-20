const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  calendarId: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("events", eventSchema);
