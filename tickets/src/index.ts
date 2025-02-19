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

// lek 431
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

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
      console.log("NATS connection closed! tickets");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // lek 431
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb tickets");
  } catch (err) {
    console.error("tickets err: ", err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000 tickets");
  });
};

start();
