//lek 282
import request from "supertest";
import { app } from "../../app";

// lek 283
import mongoose from "mongoose";

// jest.mock('../../nats-wrapper')

it("returns a 404 if the ticket is not found", async () => {
  // await request(app).get("/api/tickets/laskdjfalksfdlkakj").send().expect(404);

  // const response = await request(app)
  //   .get("/api/tickets/laskdjfalksfdlkakj")
  //   .send();

  // console.log("response.body: ", response.body);

  // lek 283
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
