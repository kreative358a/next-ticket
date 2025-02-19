// lek 358
import mongoose from "mongoose";

// lek 360
import { OrderStatus } from "@next-ticket/common";

// lek 362
import { TicketDoc } from "./ticket";

// lek 365
export { OrderStatus };

// lek 417
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// lek 358
interface OrderAttrs {
  userId: string;
  // status: string;

  // lek 360
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  // status: string;

  // lek 360
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number; // lek 407
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,

      // lek 360
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// lek 417
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
