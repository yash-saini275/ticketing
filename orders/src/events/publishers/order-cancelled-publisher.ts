import {Subjects, Publisher, OrderCancelledEvent} from '@ysaini_tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
