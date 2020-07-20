const Events = require('../models/events');

module.exports = {};

module.exports.find = async (calendarId) => {
  return await Events.find({ calendarId: calendarId });
}

module.exports.create = async (calendarId, name, date) => {
  return await Events.create({ calendarId, name, date });
};

module.exports.getById = async (id) => {
  return await Events.findOne({ _id: id });
};

module.exports.deleteById = async (id) => {
  return await Events.deleteOne({ _id: id });
};

module.exports.findByIdAndUpdate = async (id, name, date) => {
  return await Events.findByIdAndUpdate(id, { $set: { name: name, date: date }});
};
