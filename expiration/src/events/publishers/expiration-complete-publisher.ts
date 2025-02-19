// lek 446
import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@next-ticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
