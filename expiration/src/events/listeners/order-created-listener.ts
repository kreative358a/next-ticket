// lek 440
import { Listener, OrderCreatedEvent, Subjects } from "@next-ticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue"; // lek 442

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); // lek 444
    // lek 442
    console.log("Waiting this many milliseconds to process the job:", delay);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay, // delay: 10000, // lek 444
      }
    );

    msg.ack();
  }
}
