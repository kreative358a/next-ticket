// lek 332
import { Publisher, Subjects, TicketCreatedEvent } from "@next-ticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
