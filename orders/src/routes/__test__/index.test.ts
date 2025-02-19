// lek 374
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { randomBytes } from "crypto";
import mongoose from "mongoose";

// const hexId = randomBytes(4).toString("hex");
//

const buildTicket = async () => {
  const ticket = Ticket.build({
    // id: hexId, // my try
    id: new mongoose.Types.ObjectId().toHexString(), // lek 418
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it("fetches orders for an particular user", async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User #2
  // tworzymy strukturę właściwości ciała z odpowiedzi,
  // którą otrzymujemy z powrotem z żądania.
  // jednocześnie zmieniamy nazwę tej właściwości ciała
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  // tworzymy strukturę właściwości ciała z odpowiedzi,
  // którą otrzymujemy z powrotem z żądania.
  // jednocześnie zmieniamy nazwę tej właściwości ciała
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    // .expect(500);
    .expect(200);

  // console.log("orderOne: ", orderOne)
  // console.log("orderTwo: ", orderTwo)

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
