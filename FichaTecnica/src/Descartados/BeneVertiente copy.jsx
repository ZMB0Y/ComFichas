import { useState, useEffect } from "react";
import ScrollToTop from "../components/ScrollToTop";
import TexturaMenu from "/TexturaMenu.png";
import Ruta from "../components/Ruta";
import "../pages/ficha.css";

const BeneVertiente = () => {
  const [anio, setAnio] = useState("2025");
  const [mesInicio, setMesInicio] = useState("1");
  const [mesFin, setMesFin] = useState("12");
  const [datos, setDatos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const obtenerDatos = () => {
    const url = `https://renic.cultura.gob.mx/fonart/gendatos/repbv.php?a=${anio}&m1=${mesInicio}&m2=${mesFin}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setDatos(data))
      .catch(err => console.error("Error al obtener datos:", err));
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const copiarTabla = () => {
    const tabla = document.getElementById("tablaBene");
    if (!tabla) return;
    const range = document.createRange();
    range.selectNode(tabla);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Tabla copiada al portapapeles");
  };

  const exportarExcel = () => {
    const tabla = document.getElementById("tablaBene");
    if (!tabla) return;
    let csv = [];
    const filas = tabla.querySelectorAll("tr");
    filas.forEach(fila => {
      const columnas = fila.querySelectorAll("th, td");
      const filaCsv = Array.from(columnas).map(col => `"${col.innerText}"`).join(",");
      csv.push(filaCsv);
    });
    const contenido = csv.join("\n");
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `beneficiarios_vertiente_${anio}_${mesInicio}-${mesFin}.csv`;
    enlace.click();
  };

  const estadosUnicos = [...new Set(datos.map(d => d.entidad))];

  const datosFiltrados = estadoFiltro === "Todos"
    ? datos
    : datos.filter(d => d.entidad === estadoFiltro);

  return (
    <>
      <ScrollToTop />
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <Ruta />
        <div className="containerP">
          <h2>Beneficiarios por vertiente</h2>

          {/* Controles superiores */}
          <div className="controles">
            <select value={mesInicio} onChange={e => setMesInicio(e.target.value)}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`Mes inicial: ${i + 1}`}</option>
              ))}
            </select>

            <select value={mesFin} onChange={e => setMesFin(e.target.value)}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`Mes final: ${i + 1}`}</option>
              ))}
            </select>

            <select value={anio} onChange={e => setAnio(e.target.value)}>
              {[...Array(7)].map((_, i) => {
                const year = 2019 + i;
                return <option key={year} value={year}>{`Año: ${year}`}</option>;
              })}
            </select>

            <button onClick={obtenerDatos}>Buscar</button>
          </div>

          {/* Tabla de resultados */}
          <div className="tablaResponsive">
            <div className="botonesTabla">
              <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
                <option value="Todos">Todos los estados</option>
                {estadosUnicos.map((estado, i) => (
                  <option key={i} value={estado}>{estado}</option>
                ))}
              </select>
              <button onClick={copiarTabla}>Copiar</button>
            </div>

            <table id="tablaBene">
              <thead>
                <tr>
                  <th>Entidad</th>
                  <th>Vertiente</th>
                  <th>Beneficiarios</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.map((fila, i) => (
                  <tr key={i}>
                    <td>{fila.entidad}</td>
                    <td>{fila.vertiente}</td>
                    <td>{fila.bene ?? 0}</td>
                    <td>${fila.monto?.toLocaleString("es-MX") ?? "0.00"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="botonExportar">
              <button onClick={exportarExcel}>Exportar a Excel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BeneVertiente;