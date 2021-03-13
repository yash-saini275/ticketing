import {TicketCreatedEvent} from '@ysaini_tickets/common';
import * as mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';

import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../orders/models/ticket';
import {TicketCreatedListener} from '../ticket-created-listener';

const setup = async () => {
  // Create an instance of a listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {listener, data, msg};
};

it('creates and saves the ticket', async () => {
  const {listener, data, msg} = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});