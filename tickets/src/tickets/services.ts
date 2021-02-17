import {TicketDto, Ticket, TicketDoc} from './models';

class TicketsService {
  public createTicket(ticketObject: TicketDto) {
    // const ticket = Ticket.build(ticketObject);

    // ticket
    //   .save()
    //   .then(value => {
    //     return value;
    //   })
    //   .catch(err => {
    //     throw new Error('Ticket is not created.');
    //   });

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
}

export {TicketsService};
