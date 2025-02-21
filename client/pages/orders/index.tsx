/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppContext, AppProps, AppInitialProps } from "next/app";

interface Ticket {
  id: string;
  title: string;
  price: number | string | any;
  userId: string;
  version: number; // lek 399
  orderId?: string; // lek 422
}

enum OrderStatus {
  Created = "created",
  Cancelled = "cancelled",
  AwaitingPayment = "awaiting:payment",
  Complete = "complete",
}

interface TicketDoc {
  title: string;
  price: number;
  version: number; // lek 407
  // lek 365
  isReserved(): Promise<boolean>;
}

interface OrderProps {
  id: string;
  userId: string;
  // status: string;

  // lek 360
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number; // lek 407
}

const OrderIndex = ({ orders }: { orders: OrderProps[] }) => {
  return (
    <div
      style={{
        width: "60%",
        minWidth: "400px",
        position: "relative",
        margin: "20px auto 20px auto",
      }}
    >
      <ul style={{ fontSize: "16px" }}>
        {orders.map((order) => {
          return (
            <li
              key={order.id}
              style={{
                lineHeight: 1,
                borderBottom: "2px solid blue",
                marginBottom: "20px",
              }}
            >
              <p>ticket: {order.ticket.title}</p>
              <p>price: {order.ticket.price}</p>
              <p>status: {order.status}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context: AppContext, client: any) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
