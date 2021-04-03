import {OrderStatus} from '@ysaini_tickets/common';
import * as mongoose from 'mongoose';
import {Document, Model} from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

export {OrderStatus};

export interface OrderDto {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderDto): OrderDoc;
}

export interface OrderDoc extends Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

const orderSchema = new mongoose.Schema<OrderDoc, OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderDto) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};
