import {Publisher, PaymentCreatedEvent, Subjects} from '@ysaini_tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
