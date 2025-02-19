// lek 270
import express, { Request, Response } from "express";

// lek 273
import { requireAuth, validateRequest } from "@next-ticket/common";

// lek 278
import { body } from "express-validator";

// lek 281
import { Ticket } from "../models/ticket";

// lek 333
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

// lek 339
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// router.post('/api/tickets', (req: Request, res: Response) => {
//   res.sendStatus(200);
// });

// lek 273
// router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
//   res.sendStatus(200);
// });

// export { router as createTicketRouter };

// // lek 278
// router.post(
//   "/api/tickets",
//   requireAuth,
//   [
//     body("title").not().isEmpty().withMessage("Title is required"),
//     body("price")
//       .isFloat({ gt: 0 })
//       .withMessage("Price must be greater than 0"),
//   ],
//   validateRequest,
//   (req: Request, res: Response) => {
//     res.sendStatus(200);
//   }
// );

// export { router as createTicketRouter };

// lek 281
router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    // // lek 333
    // await new TicketCreatedPublisher(client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    // });

    // lek 339
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version, // lek 405
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
