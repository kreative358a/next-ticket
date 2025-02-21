/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import useRequest from "../hooks/use-request"; // lek 488
import Router from "next/router"; // lek 489

interface Ticket {
  id: string;
  title: string;
  price: number | string | any;
  userId: string;
  version: number; // lek 399
  orderId?: string; // lek 422
}

const UpdateTicket = ({ ticket }: { ticket: Ticket }) => {
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState(ticket.price);
  const [ticketId, setTicketId] = useState("");

  // lek 488
  const { doRequest, errors } = useRequest({
    // url: `/api/tickets/${ticket.id}`,
    url: `/api/tickets/${ticket.id}`,
    method: "put",
    body: {
      title,
      price,
    },
    onSuccess: (ticket: Ticket) => {
      console.log(ticket);
      Router.push(`/tickets/${ticket.id}/update`);
    },
  });

  // lek 488
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div
      style={{
        width: "60%",
        minWidth: "400px",
        position: "relative",
        margin: "20px auto 20px auto",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ fontSize: "18px" }}>Title</label>
          <input
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            pattern="[A-Za-z0-9& ]{3,}"
            title="Min 3 letter title"
            required
          />
        </div>
        <div className="form-group">
          <label style={{ fontSize: "18px" }}>Price</label>
          <input
            defaultValue={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            pattern="[0-9]+([\.,][0-9]+)?"
            title="Only numbers allowed"
            required
            // type="number"
            // step="0.01"
          />
        </div>
        {errors}
        <button className="btn btn-primary" style={{ marginTop: "10px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateTicket;

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     doRequest();
//     const formData = new FormData(event.currentTarget);
//     const ticketDetails = {
//       ...Object.fromEntries(formData),
//       // price,
//       // title
//     };
//     onSubmit(ticketDetails)
//     };

//   const onBlur = () => {
//     const value = parseFloat(price);

//     if (isNaN(value)) {
//       return;
//     }

//     setPrice(value.toFixed(2));
//   };

//   return (
//     <div
//       style={{
//         width: "60%",
//         minWidth: "400px",
//         position: "relative",
//         margin: "20px auto 20px auto",
//       }}
//     >
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label style={{ fontSize: "18px" }}>Title</label>
//           <input
//             defaultValue={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="form-control"
//             pattern="[A-Za-z0-9& ]{3,}"
//             title="Min 3 letter title"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label style={{ fontSize: "18px" }}>Price</label>
//           <input
//             defaultValue={price}
//             onBlur={onBlur}
//             onChange={(e) => setPrice(e.target.value)}
//             className="form-control"
//             pattern="[0-9]+([\.,][0-9]+)?"
//             title="Only numbers allowed"
//             required
//             // type="number"
//             // step="0.01"
//           />
//         </div>
//         {errors}
//         <button className="btn btn-primary" style={{ marginTop: "10px" }}>
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// });

// export default UpdateTicket;
