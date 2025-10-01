import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import "./ficha.css";
import TexturaMenu from "/TexturaMenu.png";
import Ruta from "../components/Ruta";

const Ficha = () => {
  const { pp } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`indi/${pp}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => {
        setDatos(data);
        setError(false);
      })
      .catch(() => {
        setDatos(null);
        setError(true);
      });
  }, [pp]);

  const copiarTablaComoHTML = () => {
    if (!datos) return;

    const tablaHTML = `
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; font-family:'Noto Sans', sans-serif;">
        <thead style="background-color:#f4f4f4;">
          <tr>
            <th rowspan="2">Nivel</th>
            <th rowspan="2">Indicador</th>
            <th rowspan="2">Definición</th>
            ${datos.datos.map(d => `<th colspan="2">${d.anio}</th>`).join("")}
          </tr>
          <tr>
            ${datos.datos.map(() => `<th>Meta</th><th>Avance</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${datos.nivel}</td>
            <td>${datos.indicador}</td>
            <td>${datos.definicion}</td>
            ${datos.datos.map(d => `
              <td>${d.meta ?? "—"}</td>
              <td>${d.avance ?? "—"}</td>
            `).join("")}
          </tr>
        </tbody>
      </table>
    `;

    const blob = new Blob([tablaHTML], { type: "text/html" });
    const item = new ClipboardItem({ "text/html": blob });

    navigator.clipboard.write([item]);
  };

  if (error) {
    return (
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <ScrollToTop />
        <div className="containerTabla">
          <h2 className="TituloTablaError">
            <Link to="/lista" className="linkErrorFicha">
              Ficha no encontrada
            </Link>
          </h2>
          <div className="tablaScroll">
            <div className="mensajeErrorFicha">
              <Link to="/lista" className="linkErrorFicha">
              <p>No se encontró información para la matrícula <strong>{pp}</strong>.</p>
              </Link>   
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="containerTabla">
        <p>Cargando ficha...</p>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Ruta pp={pp} />
      <div className="containerTabla">
        <h2 className="TituloTabla">{datos.titulo}</h2>
        <p><strong>Fecha de actualización:</strong> {datos.fecha_actualizacion}</p>

        <div className="tablaConBoton">
          <div className="contenedorBotonTabla">
            <button onClick={copiarTablaComoHTML} className="botonCopiar">
              Copiar
            </button>
          </div>

          <div className="tablaScroll">
            <table className="tablaIndicadores">
              <thead>
                <tr>
                  <th rowSpan="2">Nivel</th>
                  <th rowSpan="2">Indicador</th>
                  <th rowSpan="2">Definición</th>
                  {datos.datos.map((item) => (
                    <th key={`anio-${item.anio}`} colSpan={2}>{item.anio}</th>
                  ))}
                </tr>
                <tr>
                  {datos.datos.map((item, i) => (
                    <>
                      <th key={`meta-${i}`}>Meta</th>
                      <th key={`avance-${i}`}>Avance</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ajusteNivel">{datos.nivel}</td>
                  <td>{datos.indicador}</td>
                  <td>{datos.definicion}</td>
                  {datos.datos.map((item, i) => (
                    <>
                      <td key={`m-${i}`}>{item.meta ?? "—"}</td>
                      <td key={`a-${i}`}>{item.avance ?? "—"}</td>
                    </>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <br />
        <h4><strong>Método de cálculo:</strong></h4>
        <p>{datos.metodo}</p>
      </div>
    </>
  );
};

export default Ficha;