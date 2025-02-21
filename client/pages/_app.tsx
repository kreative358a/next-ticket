/* eslint-disable @typescript-eslint/no-explicit-any */
import buildClient from "../api/build-client";
import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";
import axios from "axios";
import App, { AppContext, AppInitialProps, AppProps } from "next/app";

// const buildClient = ({ req }) => {
//   if (typeof window === "undefined") {
//     return axios.create({
//       baseURL:
//         "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
//       headers: req.headers,
//     });
//   } else {
//     return axios.create({
//       baseUrl: "/",
//     });
//   }
// };

// const AppComponent = ({ Component, pageProps, currentUser }) => {
//   return (
//     <div>
//       <Header currentUser={currentUser} />
//       <div className="container">
//         <Component currentUser={currentUser} {...pageProps} />
//       </div>
//     </div>
//   );
// };

// AppComponent.getInitialProps = async (appContext) => {
//   const client = buildClient(appContext.ctx);
//   console.log("client: ", client);
//   console.log("typeof client: ", typeof client);
//   const { data } = await client.get("/api/users/currentuser");

//   let pageProps = {};
//   if (appContext.Component.getInitialProps) {
//     pageProps = await appContext.Component.getInitialProps(
//       appContext.ctx,
//       client,
//       data.currentUser
//     );
//   }

//   return {
//     pageProps,
//     ...data,
//   };
// };

// export default AppComponent;

// https://nextjs.org/docs/pages/building-your-application/routing/custom-app
type AppOwnProps = {
  currentUser: Record<string, string | any>;
  // req: Record<string, string | any>
};

const AppComponent = ({
  Component,
  pageProps,
  currentUser,
}: AppProps & AppOwnProps) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (
  appContext: any
): Promise<AppOwnProps & AppInitialProps> => {
  // const ctx = await App.getInitialProps(appContext)
  const client = buildClient(appContext.ctx);
  // console.log("client: ", client);
  // console.log("typeof client: ", typeof client);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
