import {OrderStatus} from '@ysaini_tickets/common';
import * as mongoose from 'mongoose';
import {Document, Model} from 'mongoose';

import {TicketDoc} from './ticket';

export {OrderStatus};
export interface OrderDto {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderDto): OrderDoc;
}

type OrderDoc = OrderDto & Document;

const orderSchema = new mongoose.Schema<OrderDoc, OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderDto) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};
