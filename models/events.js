const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  calendarId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'calendars' },
  name: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("events", eventSchema);
