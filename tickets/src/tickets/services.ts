import {NotAuthorizedError, NotFoundError} from '@ysaini_tickets/common';
import {TicketCreatedPublisher} from '../events/publishers/ticket-created-publisher';
import {TicketUpdatedPublisher} from '../events/publishers/ticket-updated-publisher';
import {natsWrapper} from '../nats-wrapper';
import {TicketDto, Ticket, TicketDoc} from './models';

class TicketsService {
  public createTicket(ticketObject: TicketDto) {
    return new Promise<TicketDoc>((resolve, reject) => {
      const ticket = Ticket.build(ticketObject);

      ticket
        .save()
        .then(async ticket => {
          await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
          });
          resolve(ticket);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public async findAllTickets() {
    const tickets = await Ticket.find({});
    return tickets;
  }

  public findTicketById(id: string) {
    return new Promise<TicketDoc | null>((resolve, reject) => {
      Ticket.findById(id)
        .exec()
        .then(ticket => {
          resolve(ticket);
        })
        .catch(err => {
          reject(new NotFoundError());
        });
    });
  }

  public async updateTicket(id: string, userId: string, newTicket: TicketDto) {
    return new Promise((resolve, reject) => {
      const ticket = Ticket.findById(id).exec();

      ticket
        .then(ticket => {
          if (!ticket) {
            reject(new NotFoundError());
          }

          if (ticket!.userId !== userId) {
            reject(new NotAuthorizedError());
          }

          ticket!.set({
            title: newTicket.title,
            price: newTicket.price,
          });

          ticket!
            .save()
            .then(ticket => {
              new TicketUpdatedPublisher(natsWrapper.client).publish({
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                id: ticket.id,
              });

              resolve(ticket);
            })
            .catch(err => {
              reject(new NotFoundError());
            });
        })
        .catch(err => {
          reject(new NotFoundError());
        });
    });
  }
}

export {TicketsService};
