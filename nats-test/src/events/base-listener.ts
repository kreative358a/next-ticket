// lek 318 - 319
import { Message, Stan } from "node-nats-streaming";

// lek 322
import { Subjects } from "./subjects";

// lek 322
interface Event {
  subject: Subjects;
  data: any;
}

// lek 322
export abstract class Listener<T extends Event> {
  // export abstract class Listener {
  // abstract subject: string;
  // abstract queueGroupName: string;
  // abstract onMessage(data: any, msg: Message): void;
  // private client: Stan;
  // protected ackWait = 5 * 1000;

  // lek 324
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
