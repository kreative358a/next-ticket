// lek 355
// import express, { Request, Response } from "express";

// const router = express.Router();

// router.post("/api/orders", async (req: Request, res: Response) => {
//   res.send({});
// });

// export { router as newOrderRouter };

// lek 357
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@next-ticket/common";
import { body } from "express-validator";

//lek 363
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

// lek 382
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// lek 366
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // lek 363
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // Make sure that this ticket is not already reserved
    // lek 364
    // Run query to look at all orders.  Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from that means the ticket *is* reserved
    // const existingOrder = await Order.findOne({
    //   ticket: ticket,
    //   status: {
    //     $in: [
    //       OrderStatus.Created,
    //       OrderStatus.AwaitingPayment,
    //       OrderStatus.Complete,
    //     ],
    //   },
    // });
    // if (existingOrder) {
    //   throw new BadRequestError('Ticket is already reserved');
    // }
    // lek 365
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    // lek 366
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    // lek 366
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created
    // lek 382
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version, // lek 405 or lek 418
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    // res.send({});
    // lek 366
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
