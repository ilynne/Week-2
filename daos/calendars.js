const Calendars = require('../models/calendars');

module.exports = {};

module.exports.create = async (name) => {
  return await Calendars.create({ name });
};

module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};

module.exports.deleteById = async (id) => {
  return await Calendars.deleteOne({ _id: id });
};
