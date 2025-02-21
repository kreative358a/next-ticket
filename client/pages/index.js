// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import buildClient from '../api/build-client';

// // const LandingPage = ({ currentUser }) => {
// //   return (
// //     <div
// //       style={{
// //         width: "90%",
// //         minWidth: "400px",
// //         position: "relative",
// //         margin: "20px auto 20px auto",
// //       }}
// //     >
// //       {currentUser ? (
// //         <h1>You are signed in</h1>
// //       ) : (
// //         <h1>You have to be signed in</h1>
// //       )}
// //     </div>
// //   );
// // };

// // lek 489
// import Link from "next/link";
// import { useState, useEffect } from "react";

// interface Ticket {
//   id: string;
//   title: string;
//   price: number | string | any;
//   userId: string;
//   version: number; // lek 399
//   orderId?: string; // lek 422
// }

// enum OrderStatus {
//   Created = "created",
//   Cancelled = "cancelled",
//   AwaitingPayment = "awaiting:payment",
//   Complete = "complete",
// }

// interface TicketDoc {
//   title: string;
//   price: number;
//   version: number; // lek 407
//   // lek 365
//   isReserved(): Promise<boolean>;
// }

// interface OrderProps {
//   id: string;
//   userId: string;
//   // status: string;

//   // lek 360
//   status: OrderStatus;
//   expiresAt: Date;
//   ticket: TicketDoc;
//   version: number; // lek 407
// }

// const LandingPage = ({
//   currentUser,
//   tickets,
//   orders,
// }: {
//   currentUser: any;
//   tickets: Ticket[];
//   orders: OrderProps[];
// }) => {
//   const [validTickets, setValidTickets] = useState<Ticket[]>([]);

//   useEffect(() => {
//     for (const ticket of tickets) {
//       if (!ticket.orderId) {
//         setValidTickets((validTickets) => [...validTickets, ticket]);
//         // console.log("ticket.orderId: ", ticket.orderId);
//         // console.log("ticket.id: ", ticket.id);
//       }
//     }
//   }, []);

//   const ticketList = validTickets.map((ticket) => {
//     //const ticketList = tickets.map((ticket) => {
//     return (
//       <tr key={ticket.id}>
//         <td>{ticket.title}</td>
//         <td>{ticket.price}</td>
//         <td>
//           <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
//             View
//           </Link>
//         </td>
//         <td>{ticket.orderId}</td>
//       </tr>
//     );
//   });

//   return (
//     <div>
//       <h1>Tickets</h1>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Price</th>
//             <th>Details</th>
//             <th>orderId</th>
//           </tr>
//         </thead>
//         <tbody>{ticketList}</tbody>
//       </table>
//     </div>
//   );
// };

// // LandingPage.getInitialProps = async context => {
// //   console.log('LANDING PAGE!');
// //   const client = buildClient(context);
// //   const { data } = await client.get('/api/users/currentuser');

// //   return data;
// // };

// // lek 485
// LandingPage.getInitialProps = async (client: any) => {
//   // return {};

//   // lek 489
//   const { data } = await client.get("/api/tickets");

//   return { tickets: data };
// };

// export default LandingPage;

import Link from "next/link";
import { useState, useEffect } from "react";

const LandingPage = ({ currentUser, tickets, orders }) => {
  const [validTickets, setValidTickets] = useState([]);

  useEffect(() => {
    for (let ticket of tickets) {
      if (!ticket.orderId) {
        setValidTickets((validTickets) => [...validTickets, ticket]);
        // console.log("ticket.orderId: ", ticket.orderId);
        // console.log("ticket.id: ", ticket.id);
      }
    }
  }, []);

  const ticketList = validTickets.map((ticket) => {
    //const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
        <td>{ticket.orderId}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Details</th>
            <th>orderId</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// LandingPage.getInitialProps = async context => {
//   console.log('LANDING PAGE!');
//   const client = buildClient(context);
//   const { data } = await client.get('/api/users/currentuser');

//   return data;
// };

// lek 485
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // return {};

  // lek 489
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
