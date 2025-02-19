// lek 326
import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  // publish(data: T["data"]) {
  // this.client.publish(this.subject, data, () => {

  // lek 327
  // this.client.publish(this.subject, JSON.stringify(data), () => {
  //   console.log("Event published.");
  // });

  // lek 328
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          console.log("console.log Event published to subject err: ", err);
          console.error("console.error Event published to subject err: ", err);
          return reject(err);
        }
        console.log("Event published to subject", this.subject);
        resolve();
      });
    });
  }
}
