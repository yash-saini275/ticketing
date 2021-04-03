import {Publisher, OrderCreatedEvent, Subjects} from '@ysaini_tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
