// lek 342
import { Publisher, Subjects, TicketUpdatedEvent } from "@next-ticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
