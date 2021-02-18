// eslint-disable-next-line node/no-unpublished-import
import * as request from 'supertest';
import {Ticket} from '../models';

// /api/tickets route test for creating a new ticket.
describe(' POST /api/tickets tests for creating new ticket.', () => {
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
    const response = await request(global.app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({});

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
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
  });
});

describe('GET /api/tickets/:id to get a ticket with particular id tests.', () => {
  it('returns a 404 if ticket is not found.', async () => {
    await request(global.app)
      .get('/api/tickets/sdfkhdskjgabakksd')
      .send()
      .expect(404);
  });

  it('returns the ticket is ticket is found.', async () => {
    const title = 'ticket',
      price = 20;

    const response = await request(global.app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price,
      })
      .expect(201);

    const ticketResponse = await request(global.app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});

const createTicket = () => {
  return request(global.app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket',
      price: 20,
    });
};

describe('GET /api/tickets. Retrieve all tickets.', () => {
  it('can fetch all the tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(global.app)
      .get('/api/tickets')
      .send()
      .expect(200);

    expect(response.body.length).toEqual(3);
  });
});

describe('PUT /api/tickets/:id. Update the ticket if it is created by logged in user', () => {
  it("returns 404 if the provided is doesn't exist", async () => {
    await request(global.app)
      .put('/api/tickets/sdfkjiohwefkj')
      .set('Cookie', global.signin())
      .send({
        title: 'ticket',
        price: 20,
      })
      .expect(404);
  });

  it('returns 401 if the user is not authenticated', async () => {
    await request(global.app)
      .put('/api/tickets/sdfkjiohwefkj')
      .send({
        title: 'ticket',
        price: 20,
      })
      .expect(401);
  });

  it("returns 401 if the user doesn't own the ticket", async () => {
    const response = await request(global.app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'ticket',
        price: 20,
      })
      .expect(201);

    await request(global.app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'New Title',
        price: 30,
      })
      .expect(401);
  });

  it('returns 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(global.app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'ticket',
        price: 20,
      })
      .expect(201);

    await request(global.app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 20,
      })
      .expect(400);

    await request(global.app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'ticket 2',
        price: -10,
      })
      .expect(400);
  });

  it('updates the tickets provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(global.app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'ticket',
        price: 20,
      })
      .expect(201);

    await request(global.app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'New Title',
        price: 40,
      })
      .expect(200);

    const ticketResponse = await request(global.app)
      .get(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send();

    expect(ticketResponse.body.title).toEqual('New Title');
    expect(ticketResponse.body.price).toEqual(40);
  });
});
