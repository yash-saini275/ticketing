import {requireAuth, validateRequest} from '@ysaini_tickets/common';
import {Router, Request, Response, NextFunction} from 'express';
import {body} from 'express-validator';
import {PaymentsService} from './services';

const paymentsRouter = Router();

paymentsRouter.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const {token, orderId} = req.body;

    PaymentsService.createCharge(token, orderId, req.currentUser!.id)
      .then(paymentId => {
        return res.send(paymentId);
      })
      .catch(next);
  }
);

export {paymentsRouter};
