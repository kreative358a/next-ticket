// lek 298
// nats czyli client jest tym, co faktycznie połączy się z naszym serwerem streamingowym
// i spróbuje wymienić z nim pewne informacje.
import nats from "node-nats-streaming";

// lek 327
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// stan to rzeczywista instancja lub klient,
// którego używamy do łączenia się z serwerem Nat streaming.
// const stan = nats.connect('ticketing', 'abc', {
// const stan = nats.connect('next-ticket', 'abc', {
//   url: 'http://localhost:4222',
// });

// stan.on('connect', () => {
//   console.log('Publisher connected to NATS');
// });

// lek 299
//  kilka ważnych elementów terminologii.
// -temat jest więc nazwą kanału, na którym chcemy publikować informacje.
// -kanał jest czymś, czego słuchamy.
// -subskrypcja jest tym, co faktycznie nasłuchuje kanału i ostatecznie odbiera pewne dane.
const stan = nats.connect("next-ticket", "abc", {
  url: "http://localhost:4222",
});

// stan.on("connect", () => {
//   console.log("Publisher connected to NATS");

// const data = JSON.stringify({
//   id: "123",
//   title: "concert",
//   price: 20,
// });

// stan.publish("ticket:created", data, () => {
//   console.log("Event published");
// });

// lek 327
// const publisher = new TicketCreatedPublisher(stan);
// publisher.publish({
//   id: "123",
//   title: "concert",
//   price: 20,
// });

// lek 328
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (err) {
    console.error("console.error publisher", err);
  }
});
