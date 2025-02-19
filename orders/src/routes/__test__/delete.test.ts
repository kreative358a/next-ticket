import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { randomBytes } from "crypto";
import mongoose from "mongoose";

// lek 384
import { natsWrapper } from "../../nats-wrapper";

// const hexId = randomBytes(4).toString("hex");
// const hexId = new mongoose.Types.ObjectId().toHexString();

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    // id: hexId, // my try
    id: new mongoose.Types.ObjectId().toHexString(), // lek 418
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

// it.todo('emits a order cancelled event');
// lek 384
it("emits a order cancelled event", async () => {
  const ticket = Ticket.build({
    // id: hexId, // my try
    id: new mongoose.Types.ObjectId().toHexString(), // lek 418
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
