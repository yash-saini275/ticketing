// eslint-disable-next-line node/no-unpublished-import
import * as request from 'supertest';
import {Ticket} from '../models';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(global.app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed of only user is signed in', async () => {
  const response = await request(global.app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an status other than 401 if user is signed in.', async () => {
  const response = await request(global.app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(global.app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(global.app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if invalid price is provided', async () => {
  await request(global.app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket',
      price: -10,
    })
    .expect(400);

  await request(global.app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket',
    })
    .expect(400);
});

it('creates a ticket with valid input', async () => {
  // Add a test to check if ticket is saved to database.
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(global.app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket',
      price: 10,
    })
    .expect(201);

  tickets = await Ticket.find({});
  console.log(tickets);
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);
});
