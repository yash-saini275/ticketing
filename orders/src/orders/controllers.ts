import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@ysaini_tickets/common';
import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import {body} from 'express-validator';

import {OrdersService} from './services';

export class OrdersController {
  private static router = express.Router();

  public static controller() {
    // POST /api/orders create a new order.
    this.router.post(
      '/api/orders',
      requireAuth,
      [
        body('ticketId')
          .not()
          .isEmpty()
          .withMessage('ticketId must be provided.'),
      ],
      validateRequest,
      (req: Request, res: Response, next: NextFunction) => {
        const {ticketId} = req.body;
        const {id} = req.currentUser!;
        OrdersService.createOrder(ticketId, id)
          .then(order => {
            return res.status(201).send(order);
          })
          .catch(next);
      }
    );

    // GET /api/orders
    this.router.get(
      '/api/orders',
      requireAuth,
      (req: Request, res: Response) => {
        OrdersService.getOrders(req.currentUser!.id)
          .then(orders => {
            return res.send(orders);
          })
          .catch(err => {
            throw new BadRequestError('Invalid Requets');
          });
      }
    );

    // GET /api/orders/:orderId get specific order
    this.router.get(
      '/api/orders/:orderId',
      requireAuth,
      (req: Request, res: Response, next: NextFunction) => {
        OrdersService.getOrderById(req.params.orderId, req.currentUser!.id)
          .then(order => {
            return res.send(order);
          })
          .catch(next);
      }
    );

    // DELETE /api/orders/:orderId to delete the order
    this.router.delete(
      '/api/orders/:orderId',
      requireAuth,
      (req: Request, res: Response, next: NextFunction) => {
        OrdersService.deleteOrder(req.params.orderId, req.currentUser!.id)
          .then(order => {
            return res.status(204).send(order);
          })
          .catch(next);
      }
    );

    return this.router;
  }
}
