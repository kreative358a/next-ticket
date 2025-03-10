// // lek 315 - 317
// import nats, { Message, Stan } from "node-nats-streaming";
// import { randomBytes } from "crypto";

// console.clear();

// const stan = nats.connect("next-ticket", randomBytes(4).toString("hex"), {
//   url: "http://localhost:4222",
// });

// stan.on("connect", () => {
//   console.log("Listener connected to NATS");

//   stan.on("close", () => {
//     console.log("NATS connection closed!");
//     process.exit();
//   });

//   new TicketCreatedListener(stan).listen();
// });

// // lek 316

// // klasa abstrakcyjna.
// // klasy abstrakcyjne nie są przeznaczone do bezpośredniego użytku.
// // należy je podklasować, aby móc z nich korzystać.
// abstract class Listener {
//   abstract subject: string;
//   abstract queueGroupName: string;
//   abstract onMessage(data: any, msg: Message): void;
//   private client: Stan;
//   protected ackWait = 5 * 1000;

//   constructor(client: Stan) {
//     this.client = client;
//   }

//   subscriptionOptions() {
//     return (
//       this.client
//         .subscriptionOptions()
//         .setDeliverAllAvailable()
//         .setManualAckMode(true)
//         // Ustawia liczbę milisekund, po upływie których wiadomość zostaje uznana
//         // za niepotwierdzoną przez serwer przesyłania strumieniowego.
//         .setAckWait(this.ackWait)
//         .setDurableName(this.queueGroupName)
//     );
//   }

//   listen() {
//     const subscription = this.client.subscribe(
//       this.subject,
//       this.queueGroupName,
//       this.subscriptionOptions()
//     );

//     subscription.on("message", (msg: Message) => {
//       console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

//       const parsedData = this.parseMessage(msg);
//       this.onMessage(parsedData, msg);
//     });
//   }

//   parseMessage(msg: Message) {
//     const data = msg.getData();
//     return typeof data === "string"
//       ? JSON.parse(data)
//       : JSON.parse(data.toString("utf8"));
//   }
// }

// // lek 317
// class TicketCreatedListener extends Listener {
//   subject = "ticket:created";
//   queueGroupName = "payments-service";

//   onMessage(data: any, msg: Message) {
//     console.log("Event data!", data);

//     msg.ack();
//   }
// }

// lek 318
import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("next-ticket", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed! nast-test");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
