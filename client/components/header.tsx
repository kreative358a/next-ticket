/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

export default function Header({ currentUser }: { currentUser: any }) {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Create Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "My Tickets", href: "/tickets" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link className="nav-link" href={href}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav
      className="navbar navbar-light bg-light"
      style={{ paddingLeft: "20px" }}
    >
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {currentUser ? currentUser.email : "Guest"} {links}
        </ul>
      </div>
    </nav>
  );
}
