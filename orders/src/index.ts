// lek 355

// lek 268
// import mongoose from "mongoose";

// import { app } from "./app";

// const start = async () => {
//   if (!process.env.JWT_KEY) {
//     throw new Error("JWT_KEY must be defined");
//   }

//   try {
//     await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");

//     console.log("Connected to MongoDb");
//   } catch (err) {
//     console.error(err);
//   }

//   app.listen(3000, () => {
//     console.log("Listening on port 3000 !!!");
//   });
// };

// start();

// lek 269
import mongoose from "mongoose";

// lek 338
import { natsWrapper } from "./nats-wrapper";

import { app } from "./app";

// lek 393
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

// lek 451
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

// lek 480
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  // lek 350
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    // lek 338
    // await natsWrapper.connect(
    //   "next-ticket",
    //   "random_client",
    //   "http://nats-srv:4222"
    // );

    // lek 350
    // console.log("process.env.JWT_KEY process.env.MONGO_URI: ", process.env.JWT_KEY);
    // console.log("process.env.MONGO_URI: ", process.env.MONGO_URI);
    // console.log("process.env.NATS_CLIENT_ID: ", process.env.NATS_CLIENT_ID);
    // console.log("process.env.NATS_URL: ", process.env.NATS_URL);
    // console.log("process.env.NATS_CLUSTER_ID: ", process.env.NATS_CLUSTER_ID);
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // lek 340 example not do this
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed! orders");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // lek 393
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    // lek 451
    new ExpirationCompleteListener(natsWrapper.client).listen();

    // lek 480
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb orders");
  } catch (err) {
    console.error("orders err: ", err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000 orders");
  });
};

start();
