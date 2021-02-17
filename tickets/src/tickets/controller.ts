import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {requireAuth, validateRequest} from '@ysaini_tickets/common';

import {TicketsService} from './services';

const ticketsRouter = Router();

const ticketsService = new TicketsService();

ticketsRouter.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is Required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    ticketsService
      .createTicket({
        title: req.body.title,
        price: req.body.price,
        userId: req.currentUser?.id as string,
      })
      .then(ticket => {
        return res.status(201).send(ticket);
      })
      .catch(err => {
        throw err;
      });
  }
);

export {ticketsRouter};
