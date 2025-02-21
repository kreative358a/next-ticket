// lek 288
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError, // lek 432
  OrderStatus,
} from "@next-ticket/common";
import { Ticket } from "../../models/ticket";

// lek 342
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

// router.put(
//   "/api/tickets/:id",
//   requireAuth,
//   async (req: Request, res: Response) => {
//     const ticket = await Ticket.findById(req.params.id);

//     if (!ticket) {
//       throw new NotFoundError();
//     }

//     // lek 289
//     if (ticket.userId !== req.currentUser!.id) {
//       throw new NotAuthorizedError();
//     }

//     res.send(ticket);
//   }
// );

// export { router as updateTicketRouter };

router.put(
  // "/api/tickets/:id",
  "/api/tickets/:id/update",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // lek 432
    if (ticket.orderId) {
      // my try
      if (OrderStatus.Complete) {
        throw new BadRequestError("Cannot edit a sold ticket");
      }

      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    // lek 342
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version, // lek 405
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
