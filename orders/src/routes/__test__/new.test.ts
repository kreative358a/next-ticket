// lek 370
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { randomBytes } from "crypto";

// lek 371
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

// lek 384
import { natsWrapper } from "../../nats-wrapper";

// const hexId = randomBytes(4).toString("hex");
// const hexId = new mongoose.Types.ObjectId().toHexString();

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId(); // lek 418

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

// it('returns an error if the ticket is already reserved', async () => {});
// lek 371
it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    // id: hexId, // my try
    id: new mongoose.Types.ObjectId().toHexString(), // lek 418
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "laskdflkajsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

// it('reserves a ticket', async () => {});
// lek 372
it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    // id: hexId, // my try
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

// lek 373
// it.todo("emits an order created event");
// lek 384
it("emits an order created event", async () => {
  const ticket = Ticket.build({
    // id: hexId, // my try
    id: new mongoose.Types.ObjectId().toHexString(), // lek 418
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // expect(natsWrapper.client.publish).not.toHaveBeenCalled();
});
