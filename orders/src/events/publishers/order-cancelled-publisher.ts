// lek 381 ...
import { Subjects, Publisher, OrderCancelledEvent } from "@next-ticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
