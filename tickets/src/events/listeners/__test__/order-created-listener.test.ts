import {OrderCreatedEvent, OrderStatus} from '@ysaini_tickets/common';
import * as mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../tickets/models';
import {OrderCreatedListener} from '../order-created-listener';

const setup = async () => {
  // Create an instance of a listener object
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  await ticket.save();

  // Create a fake data object
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'asdf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };

  // Fake message object
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {listener, ticket, data, msg};
};

it('Sets the userId of the ticket', async () => {
  const {listener, msg, data, ticket} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('calls the ack function', async () => {
  const {listener, msg, data} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const {listener, msg, data} = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
