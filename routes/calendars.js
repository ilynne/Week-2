const { Router } = require("express");
const router = Router();
var events = require('./events');

const CalendarDAO = require('../daos/calendars');
const { get } = require("mongoose");

router.get("/", async (req, res, next) => {
  const calendars = await CalendarDAO.find();
  res.json(calendars);
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
  } else {
    const calendar = await CalendarDAO.create(name);
    res.json(calendar);
  }
});

router.get("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.getById(req.params.id);
  if (calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.deleteById(req.params.id);
  res.sendStatus(200);
});

router.put("/:id", async (req, res, next) => {
  const { name } = req.body;
  const calendar = await CalendarDAO.findByIdAndUpdate(req.params.id, name);
  res.json(calendar);
})

router.use('/:calendarId/events', events)

module.exports = router;
