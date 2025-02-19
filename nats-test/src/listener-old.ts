// lek 301

// import nats from "node-nats-streaming";

// console.clear();

// const stan = nats.connect("next-ticket", "123", {
//   url: "http://localhost:4222",
// });

// stan.on("connect", () => {
//   console.log("Listener connected to NATS");

//   const subscription = stan.subscribe("ticket:created");

//   subscription.on("message", (msg) => {
//     console.log("Message received");
//   });
// });

import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

// const stan = nats.connect("next-ticket", "123", {
//   url: "http://localhost:4222",
// });

const stan = nats.connect("next-ticket", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // lek 307
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  //   const subscription = stan.subscribe("ticket:created");

  // lek 304
  //   const subscription = stan.subscribe(
  //     "ticket:created",
  //     "orders-service-queue-group"
  //   );

  // lek 305
  const options = stan
    // subscriptionOptions() returns a SubscriptionOptions initialized to defaults
    .subscriptionOptions()
    // setManualAckMode configures the subscription to require manual
    // acknowledgement of messages using Message#acknowledge.
    // @param tf — true if manual acknowledgement is required.
    .setManualAckMode(true)
    // lek 313
    // Configures the subscription to replay from first available message.
    // Konfiguruje subskrypcję w celu odtwarzania od pierwszej dostępnej wiadomości.
    .setDeliverAllAvailable()
    //   Ustawia trwałą nazwę subskrypcji, którą klient może określić dla subskrypcji.
    //   Umożliwia to subskrybentowi zamknięcie połączenia bez anulowania subskrypcji
    //   i wznowienie subskrypcji z tą samą trwałą nazwą.
    //   Należy pamiętać, że serwer wznowi subskrypcję z wiadomościami,
    //   które nie zostały potwierdzone.
    .setDurableName("accounting-service");

  //   const subscription = stan.subscribe(
  //     "ticket:created",
  //     "orders-service-queue-group",
  //     options
  //   );

  // lek 313
  // const subscription = stan.subscribe("ticket:created", options);

  // 314
  const subscription = stan
    // Subscribes to a given subject as an optional member of a queue group.
    //   @param subject
    //   @param qGroup
    //   @param opts
    .subscribe("ticket:created", "queue-group-name", options);

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    // Eck powie bibliotece streamingowej node net, aby skontaktowała się z serwerem streamingowym nat
    // i powiedziała mu Hej, otrzymaliśmy wiadomość i została ona przetworzona.
    msg.ack();
  });
});

// lek 307
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
