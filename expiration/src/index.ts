// lek 435
import { natsWrapper } from "./nats-wrapper";
// lek 442
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
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
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed! expiration");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // lek 442
    new OrderCreatedListener(natsWrapper.client).listen();

    console.log("try expiration");
  } catch (err) {
    console.error("expiration err: ", err);
  }
};

start();
