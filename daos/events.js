const Events = require('../models/events');

module.exports = {};

module.exports.find = async (calendarId) => {
  return await Events.find({ calendarId: calendarId });
}

module.exports.create = async (calendarId, name, date) => {
  return await Events.create({ calendarId, name, date });
};

module.exports.getById = async (id) => {
  try {
    const event = await Events.findOne({ _id: id }).lean();
    return event;
  } catch (e) {
    return null;
  }
};

module.exports.deleteById = async (id) => {
  return await Events.deleteOne({ _id: id });
};

module.exports.findByIdAndUpdate = async (id, name) => {
  return await Events.findByIdAndUpdate(id, { $set: { name: name }});
};
