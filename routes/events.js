const { Router } = require("express");
const router = Router({ mergeParams: true});

const EventsDAO = require('../daos/events');
const { get } = require("mongoose");

router.get("/", async (req, res, next) => {
  const events = await EventsDAO.find(req.params.calendarId);
  res.json(events);
});

router.get("/:id", async (req, res, next) => {
  const event = await EventsDAO.getById(req.params.id);
  if (event) {
    console.log('event exists', event)
    res.json(event);
  } else {
    console.log('not found')
    res.status(404).send('not found');
  }
});

router.post("/", async (req, res, next) => {
  const { name, date } = req.body;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
  } else if (!date) {
    res.status(400).send('body parameter "date" is required');
  } else {
    const event = await EventsDAO.create(req.params.calendarId, name, date);
    res.json(event);
  }
});

router.delete("/:id", async (req, res, next) => {
  const event = await EventsDAO.deleteById(req.params.id);
  res.sendStatus(200);
});

router.put("/:id", async (req, res, next) => {
  const { name, date } = req.body;
  if (!name || !date) {
    res.status(400).send('body parameter "name" or "date" is required"');
  } else {
    const event = await EventsDAO.findByIdAndUpdate(req.params.id, name, date);
    res.json(event);
  }
})

module.exports = router;
