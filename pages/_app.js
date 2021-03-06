import { useEffect, useState } from "react";
import Header from "../components/Header";
import GlobalStyle from "../styles/global-style";
import PageTransition from "../components/PageTransition";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }) => {
  // we use the routingPageOffset to prevent the window from scrolling to top before the animation
  const [routingPageOffset, setRoutingPageOffset] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const pageChange = () => {
      setRoutingPageOffset(window.scrollY);
    };
    router.events.on("routeChangeStart", pageChange);
  }, [router.events]);
  return (
    <>
      <Header />
      <PageTransition
        route={router.asPath}
        routingPageOffset={routingPageOffset}
      >
        <Component {...pageProps} />
      </PageTransition>
      <GlobalStyle />
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
};

export default MyApp;
