import * as mongoose from 'mongoose';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from '@ysaini_tickets/common';

import {Ticket, TicketDto} from './models/ticket';
import {Order, OrderDto} from './models/order';

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

    return order;
  }
}
