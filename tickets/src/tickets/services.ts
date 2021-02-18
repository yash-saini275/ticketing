import {NotAuthorizedError, NotFoundError} from '@ysaini_tickets/common';
import {TicketDto, Ticket, TicketDoc} from './models';

class TicketsService {
  public createTicket(ticketObject: TicketDto) {
    return new Promise<TicketDoc>((resolve, reject) => {
      const ticket = Ticket.build(ticketObject);

      ticket
        .save()
        .then(value => {
          resolve(value);
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

  public updateTicket(id: string, userId: string, newTicket: TicketDto) {
    return new Promise((resolve, reject) => {
      Ticket.findOneAndUpdate({_id: id}, newTicket)
        .exec()
        .then(ticket => {
          if (!ticket) {
            reject(new NotFoundError());
          }

          if (ticket?.userId !== userId) {
            reject(new NotAuthorizedError());
          }

          ticket!.title = newTicket.title;
          ticket!.price = newTicket.price;

          resolve(ticket);
        })
        .catch(err => {
          reject(new NotFoundError());
        });
    });
  }
}

export {TicketsService};
