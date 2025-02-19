// import buildClient from '../api/build-client';

// const LandingPage = ({ currentUser }) => {
//   return (
//     <div
//       style={{
//         width: "90%",
//         minWidth: "400px",
//         position: "relative",
//         margin: "20px auto 20px auto",
//       }}
//     >
//       {currentUser ? (
//         <h1>You are signed in</h1>
//       ) : (
//         <h1>You have to be signed in</h1>
//       )}
//     </div>
//   );
// };

// lek 489
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
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
