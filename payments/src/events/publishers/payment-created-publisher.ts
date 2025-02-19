// lek 478
import { Subjects, Publisher, PaymentCreatedEvent } from "@next-ticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
