// lek 388
import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@next-ticket/common";
import { Ticket } from "../../models/ticket";

// lek 389
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // queueGroupName = 'orders-service';
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    // // lek 390
    // const { title, price } = data;

    // lek 391
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id, // lek 391
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
