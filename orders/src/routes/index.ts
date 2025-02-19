// lek 355
import express, { Request, Response } from "express";

// lek 373
import { requireAuth } from "@next-ticket/common";
import { Order } from "../models/order";

const router = express.Router();

// router.get("/api/orders", async (req: Request, res: Response) => {
//   res.send({});
// });

// lek 373
router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  // pobieramy zamówienia przypisane do użytkownika
  const orders = await Order.find({
    userId: req.currentUser!.id,
  })
    // ładujemy powiązany lub powiązane dane biletów
    .populate("ticket");

  res.send(orders);
});

export { router as indexOrderRouter };
