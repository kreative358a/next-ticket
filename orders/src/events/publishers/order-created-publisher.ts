// lek 381 ...
import { Publisher, OrderCreatedEvent, Subjects } from "@next-ticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
