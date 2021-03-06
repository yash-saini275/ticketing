// eslint-disable-next-line node/no-unpublished-import
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import {Order, OrderStatus} from '../models/order';
import {Ticket} from '../models/ticket';
import {natsWrapper} from '../../nats-wrapper';

const app = global.app;

describe('POST /api/orders test for creating new order', () => {
  it("returns an error if ticket doesn't exist.", async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ticketId})
      .expect(404);
  });

  it('returns an error if ticket is already reserved', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });

    await ticket.save();

    const order = Order.build({
      ticket,
      userId: 'sadfsaf',
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });

    await order.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({tickedId: ticket.id})
      .expect(400);
  });

  it('reserves a ticket', async () => {
    const ticket = Ticket.build({
      title: 'Concert',
      price: 20,
    });
    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ticketId: ticket.id})
      .expect(201);
  });

  it('Emits an order created event.', async () => {
    const ticket = Ticket.build({
      title: 'Concert',
      price: 20,
    });
    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ticketId: ticket.id})
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

const buildTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    title,
    price,
  });

  await ticket.save();

  return ticket;
};

describe('GET /api/orders to fetch orders created by user', () => {
  it('fetches order for a particular user', async () => {
    const ticketOne = await buildTicket('Concert 1', 10);
    const ticketTwo = await buildTicket('Concert 2', 20);
    const ticketThree = await buildTicket('Concert 3', 30);

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({
        ticketId: ticketOne.id,
      })
      .expect(201);

    const {body: orderOne} = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({
        ticketId: ticketTwo.id,
      })
      .expect(201);

    const {body: orderTwo} = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({
        ticketId: ticketThree.id,
      })
      .expect(201);

    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .expect(200);

    expect(response.body.length).toEqual(2);

    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
  });
});

describe('GET /api/order/:orderId fetches specific order', () => {
  it('fetched the order', async () => {
    // Create a ticket.
    const ticketOne = Ticket.build({
      title: 'Concert',
      price: 20,
    });

    await ticketOne.save();

    const user = global.signin();
    // Make a request to build an order with this ticket.
    const {body: order} = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({
        ticketId: ticketOne.id,
      })
      .expect(201);

    // Make a request to fetch a ticket.
    const {body: fetchedOrder} = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });

  it('not authorized error if user tries to fetch someone else order', async () => {
    // Create a ticket.
    const ticketOne = Ticket.build({
      title: 'Concert',
      price: 20,
    });

    await ticketOne.save();

    const userOne = global.signin();
    const userTwo = global.signin();
    // Make a request to build an order with this ticket.
    const {body: order} = await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({
        ticketId: ticketOne.id,
      })
      .expect(201);

    // Make a request to fetch a ticket.
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', userTwo)
      .send()
      .expect(401);
  });
});

describe('DELETE /api/orders/:orderId to delete a order', () => {
  it('marks an order as cancelled', async () => {
    // Create a ticket
    const ticket = Ticket.build({
      title: 'Concert',
      price: 20,
    });

    await ticket.save();

    const user = global.signin();

    // Make a request to create a order
    const {body: order} = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    // Make a request to cancel the order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204);

    // Expectation to make sure order is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('Emits an order cancelled event', async () => {
    // Create a ticket
    const ticket = Ticket.build({
      title: 'Concert',
      price: 20,
    });

    await ticket.save();

    const user = global.signin();

    // Make a request to create a order
    const {body: order} = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    // Make a request to cancel the order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204);

    // Expectation to make sure order is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });
});
