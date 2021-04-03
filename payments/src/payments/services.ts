import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@ysaini_tickets/common';
import * as mongoose from 'mongoose';
import {Order} from './models/order';
import {Payment} from './models/payment';
import {PaymentCreatedPublisher} from './events/publishers/payment-created-publisher';
import {natsWrapper} from '../nats-wrapper';

export class PaymentsService {
  public static async createCharge(
    token: string,
    orderId: string,
    userId: string
  ) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot Pay for cancelled order');
    }

    // Strip payments API stuff.
    const paymentId = mongoose.Types.ObjectId().toHexString();

    const payment = Payment.build({
      orderId,
      stripeId: paymentId,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    return payment.id;
  }
}
