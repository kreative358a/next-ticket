// lek 319
import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

// lek 322
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

// lek 322
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // export class TicketCreatedListener extends Listener {

  // subject = 'ticket:created';
  // lek 322
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  // lek 324
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    // onMessage(data: any, msg: Message) {
    console.log("Event data!", data);

    // console.log(data.name);
    // console.log(data.cost);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
