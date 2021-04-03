import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@ysaini_tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
