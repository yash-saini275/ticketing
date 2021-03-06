import {OrderCreatedEvent, OrderStatus} from '@ysaini_tickets/common';
import * as mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {natsWrapper} from '../../../../nats-wrapper';
import {Order} from '../../../models/order';
import {OrderCreatedListener} from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'asdf',
    userId: 'sadf',
    status: OrderStatus.Created,
    ticket: {
      id: 'asdf',
      price: 10,
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {listener, data, msg};
};

it('replicates the order info', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
