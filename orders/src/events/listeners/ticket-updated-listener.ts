// lek 392
import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@next-ticket/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // const ticket = await Ticket.findById(data.id);

    // lek 407
    // const ticket = await Ticket.findOne({
    //   _id: data.id,
    //   version: data.version - 1,
    // });

    // lek 409
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });

    // lek 410
    // const { title, price, version } = data;
    // ticket.set({ title, price, version });

    await ticket.save();

    msg.ack();
  }
}
