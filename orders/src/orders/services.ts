import * as mongoose from 'mongoose';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@ysaini_tickets/common';

import {Ticket, TicketDto} from './models/ticket';
import {Order, OrderDto} from './models/order';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';
import {natsWrapper} from '../nats-wrapper';
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher';

export class OrdersService {
  private static EXPIRATION_WINDOW_SECONDS = 15 * 60;

  public static async createOrder(
    ticketId: mongoose.Types.ObjectId,
    userId: string
  ) {
    // Find the ticket the user is trying to order in database.
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved.
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration time.
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + this.EXPIRATION_WINDOW_SECONDS
    );
    // Build the order and save in database.
    const order = Order.build({
      userId: userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an event saying that event is created.
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    return order;
  }

  public static async getOrders(userId: string) {
    const orders = Order.find({
      userId,
    }).populate('ticket');

    return orders;
  }

  public static async getOrderById(orderId: string, userId: string) {
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    return order;
  }

  public static async deleteOrder(orderId: string, userId: string) {
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    return order;
  }
}
