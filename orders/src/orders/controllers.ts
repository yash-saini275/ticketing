import {requireAuth, validateRequest} from '@ysaini_tickets/common';
import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import {body} from 'express-validator';

import {OrdersService} from './services';

export class OrdersController {
  private static router = express.Router();

  public static controller() {
    // Create a new order.
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
      async (req: Request, res: Response, next: NextFunction) => {
        const {ticketId} = req.body;
        const {id} = req.currentUser!;
        OrdersService.createOrder(ticketId, id)
          .then(order => {
            return res.status(201).send(order);
          })
          .catch(next);
      }
    );

    return this.router;
  }
}
