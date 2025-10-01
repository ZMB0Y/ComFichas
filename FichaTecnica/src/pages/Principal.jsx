import { Link, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import TexturaMenu from "/TexturaMenu.png";
import "./principal.css";

const Principal = () => {
  return (
    <>
      <ScrollToTop />
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <h1>SCAPS</h1>
        <br />
        <br />
        
        <Link to="/lista" className="botonEntrada">
          Entrar

        </Link>
      </div>
    </>
  );
};

export default Principal;
