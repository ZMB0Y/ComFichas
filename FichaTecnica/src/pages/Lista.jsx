import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import TexturaMenu from "/TexturaMenu.png";
import "./lista.css";

const Lista = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    fetch("./reportes.json")
      .then(res => res.json())
      .then(data => setReportes(data.reportes))
      .catch(err => console.error("Error al cargar reportes.json:", err));
  }, []);

  const rutasPersonalizadas = {
    "Cultura-Cinematografia": "/reporte/Cultura-Cinematografia",
    "Radio-TV": "/reporte/Radio-TV",
    
  };

  return (
    <>
      <ScrollToTop />
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <div className="containerP">
          <div className="listadoGrid">
            <div className="columna">
              <h2>Comisiones</h2>
              <ul className="listado">
                {reportes.map((reporte, index) => {
                  const ruta = rutasPersonalizadas[reporte.id] || `/reporte/${reporte.id}`;
                  return (
                    <li key={index}>
                      <Link to={ruta} className="listadoLink">
                        <strong>{index + 1}</strong> – {reporte.titulo}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lista;