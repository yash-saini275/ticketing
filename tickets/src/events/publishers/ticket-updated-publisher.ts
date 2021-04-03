import {Publisher, Subjects, TicketUpdatedEvent} from '@ysaini_tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
