// eslint-disable-next-line node/no-unpublished-import
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import {Order, OrderStatus} from '../models/order';
const app = global.app;

describe('POST /api/payments to create make payment.', () => {
  it('returns a 404 when purchasing an order that does not exits', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'sadf',
        orderId: mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it("returns a 401 when purchasing an order that doesn't belong to user", async () => {
    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'sadf',
        orderId: order.id,
      })
      .expect(401);
  });

  it('returns 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({
        token: 'safdasf',
        orderId: order.id,
      })
      .expect(400);
  });
});
