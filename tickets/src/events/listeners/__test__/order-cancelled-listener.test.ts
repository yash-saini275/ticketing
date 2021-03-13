import {OrderCancelledEvent} from '@ysaini_tickets/common';
import * as mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../tickets/models';
import {OrderCancelledListener} from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    userId: 'sadf',
  });
  ticket.set({orderId});
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {listener, ticket, msg, data, orderId};
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const {listener, ticket, msg, data} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
