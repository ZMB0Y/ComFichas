import { Link } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop";
import { useEffect } from "react";
import ReactGA from "react-ga4";

const P404Page = () => {

  useEffect(() => {
    document.title = 'ISC: P404';
    ReactGA.send({hitType: "pageview", page: "/P404",title: document.title})
  }, []);
  
  return (
    <>
      <ScrollToTop/>
      <main className="contenido p404">
        <div className="titulo404">404</div>
        <Link to="/">Ir a la página principal</Link>
      </main>
      <Pie/>
    </>
  );
};

export default P404Page;