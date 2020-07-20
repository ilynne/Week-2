const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/calendars/:calendarId/events", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe("GET /events", () => {
    it("should return an empty array if no matching calendarId", async () => {
      const res = await request(server).get("/calendars/id1/events");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('calendar exists', () => {
    let calendar1, calendar2;

    beforeEach(async () => {
      calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
      calendar2 = (await request(server).post("/calendars").send({ name: 'calendar2' })).body;
    });

    describe('POST /events', () => {
      it('should return a 400 without a provided name', async () => {
        const res = await request(server).post(`/calendars/${calendar1._id}/events`).send({ date: '2020-07-01' });
        expect(res.statusCode).toEqual(400);
      });

      it('should return a 400 without a provided date', async () => {
        const res = await request(server).post(`/calendars/${calendar1._id}/events`).send({ name: 'event 1' });
        expect(res.statusCode).toEqual(400);
      });
    });

    describe('GET /events/:id after multiple POST /', () => {
      let event1, event2;

      beforeEach(async () => {
        event1 = (await request(server).post(`/calendars/${calendar1._id}/events`).send({ name: 'event1', date: '2020-07-01' })).body;
        event2 = (await request(server).post(`/calendars/${calendar1._id}/events`).send({ name: 'event2', date: '2020-07-03' })).body;
      });

      it('should return event1 using its id', async () => {
        const res = await request(server).get(`/calendars/${calendar1._id}/events/${event1._id}`);
        expect(res.statusCode).toEqual(200);
        const storedEvent = res.body;
        expect(storedEvent).toMatchObject({
          name: 'event1',
          _id: event1._id,
          calendarId: calendar1._id,
          date: '2020-07-01T00:00:00.000Z'
        });
      });

      it('should return event2 using its id', async () => {
        const res = await request(server).get(`/calendars/${calendar1._id}/events/${event2._id}`);
        expect(res.statusCode).toEqual(200);
        const storedEvent = res.body;
        expect(storedEvent).toMatchObject({
          name: 'event2',
          _id: event2._id,
          calendarId: calendar1._id,
          date: '2020-07-03T00:00:00.000Z'
        });
      });

      describe('PUT /:id after POST /', () => {
        it('should return a 400 without a provided name or date', async () => {
          const res = await request(server)
            .put(`/calendars/${calendar1._id}/events/${event1._id}`)
            .send({});
          expect(res.statusCode).toEqual(400);
        });

        it('should store and return event1 with new name and date', async () => {
          const res = await request(server)
            .put(`/calendars/${calendar1._id}/events/${event1._id}`)
            .send({ name: 'new name', date: '2020-07-15' });
          expect(res.statusCode).toEqual(200);

          const storedEvent = (await request(server)
            .get(`/calendars/${calendar1._id}/events/${event1._id}`)).body;

          expect(storedEvent).toMatchObject({
            name: 'new name',
            _id: event1._id,
            calendarId: calendar1._id,
            date: '2020-07-15T00:00:00.000Z'
          });
        });
      });

      describe('DELETE /events/:id after POST', () => {
        let event3;

        it('should delete and not return calendar1 on next GET', async () => {
          const res = await request(server).delete(`/calendars/${calendar1._id}/events/${event1._id}`);
          expect(res.statusCode).toEqual(200);
          const storedCalendarResponse = await request(server).get(`/calendars/${calendar1._id}/events/${event1._id}`);
          expect(storedCalendarResponse.status).toEqual(404);
        });
      });
    });
  });
})
