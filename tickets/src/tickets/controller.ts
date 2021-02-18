import {NextFunction, Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorizedError,
} from '@ysaini_tickets/common';

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

ticketsRouter.get(
  '/api/tickets/:id',
  (req: Request, res: Response, next: NextFunction) => {
    ticketsService
      .findTicketById(req.params.id)
      .then(ticket => {
        return res.send(ticket);
      })
      .catch(next);
  }
);

ticketsRouter.get(
  '/api/tickets',
  (req: Request, res: Response, next: NextFunction) => {
    ticketsService
      .findAllTickets()
      .then(tickets => {
        return res.send(tickets);
      })
      .catch(next);
  }
);

ticketsRouter.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is Required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    ticketsService
      .updateTicket(req.params.id, req.currentUser?.id as string, {
        title: req.body.title,
        price: req.body.price,
        userId: req.currentUser?.id as string,
      })
      .then(ticket => {
        return res.send(ticket);
      })
      .catch(next);
  }
);

export {ticketsRouter};
