/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import UpdateTicket from "../../components/update-ticket";
import { AppContext, AppProps, AppInitialProps } from "next/app";
import Router, { useRouter } from "next/router"; // lek 493
// import { redirect } from "next/navigation";

type CurrentUserProps = {
  id: string;
  email: string;
  password: string;
};

interface TicketProps {
  id: string;
  title: string;
  price: number | string | any;
  userId: string;
  version: number; // lek 399
  orderId?: string; // lek 422
}

type AppOwnProps = { client: any };

const OwnerTicketIndex = ({
  tickets,
  currentUser,
}: {
  tickets: TicketProps[];
  currentUser: CurrentUserProps;
}) => {
  const [myTickets, setMyTickets] = useState<TicketProps[]>([]);
  // const [title, setTitle] = useState();
  // const [price, setPrice] = useState();

  // const router = useRouter();

  // Router.push("/");

  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    } else {
      for (const ticket of tickets) {
        if (ticket.userId === currentUser.id) {
          setMyTickets((myTickets) => [...myTickets, ticket]);
        }
      }
    }
  }, []);

  // console.log("tickets: ", tickets);
  return (
    <div
      style={{
        width: "60%",
        minWidth: "400px",
        position: "relative",
        margin: "20px auto 20px auto",
      }}
    >
      <p className="text-blue-900">
        current user email {currentUser ? currentUser.email : ""} <br />
        current user id {currentUser ? currentUser.id : ""}
      </p>
      <ul style={{ fontSize: "16px" }}>
        {myTickets.map((ticket) => {
          // function handleSubmit(ticketDetails: any) {
          //   post("some-url", {
          //     ticketDetails
          //   });
          //   setTitle(ticketDetails.title);
          //   setPrice(ticketDetails.price);
          // }
          // function post(url:string, data:any) {
          //   // Imagine this sends a request...
          //   console.log("POST /" + url);
          //   console.log(data);
          // }
          return (
            <li
              key={ticket.id}
              style={{
                lineHeight: 1,
                borderBottom: "2px solid blue",
                marginBottom: "20px",
              }}
            >
              <p>ticket: {ticket.title}</p>
              <p>price: {ticket.price}</p>
              <p>
                status:{" "}
                <span>{ticket.orderId ? "sold or reserved" : "unsold"}</span>
              </p>
              {ticket.orderId ? (
                ""
              ) : (
                <>
                  <Link
                    className="nav-link"
                    // href={`/tickets/update/${ticket.id}`}
                    href={`/tickets/${ticket.id}/update`}
                  >
                    update
                  </Link>
                  <UpdateTicket ticket={ticket} />
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OwnerTicketIndex.getInitialProps = async (context: AppContext, client: any) => {
  const { data } = await client.get("/api/tickets");
  // const { data_orders } = await client.get("/api/orders");

  return { tickets: data };
};

export default OwnerTicketIndex;
function post(arg0: { ticketDetails: any }) {
  throw new Error("Function not implemented.");
}
