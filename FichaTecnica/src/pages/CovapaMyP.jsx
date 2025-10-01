import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ScrollToTop from "../components/ScrollToTop";
import RutaIndicadores from "../components/Ruta";
import "./ficha.css";
import TexturaMenu from "/TexturaMenu.png";

const CovapaMyP = () => {
  const [anio, setAnio] = useState(2024);
  const [mesInicial, setMesInicial] = useState(1);
  const [mesFinal, setMesFinal] = useState(12);
  const [datos, setDatos] = useState([]);
  const [titulos, setTitulos] = useState([]);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const fetchDatos = async () => {
    try {
      const url = `https://renic.cultura.gob.mx/fonart/gendatos/rcmp.php?a=${anio}&m1=${mesInicial}&m2=${mesFinal}`;
      const res = await fetch(url);
      const json = await res.json();
      setTitulos(json.titulos ?? []);
      setDatos(json.datos ?? []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setTitulos([]);
      setDatos([]);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [anio, mesInicial, mesFinal]);

  const copiarTablaComoHTML = () => {
    const tabla = document.querySelector(".tablaIndicadores");
    if (!tabla) return;
    const range = document.createRange();
    range.selectNode(tabla);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("No se pudo copiar la tabla como HTML:", err);
    }
    selection.removeAllRanges();
  };

  const exportarExcel = () => {
    const encabezado = ["Clave Covapa", "Vertiente", "Beneficiarios", "Monto Asignado"];
    const wsData = [
      [`3 – Consulta COVAPAS por Mes y Periodo ${anio} (${meses[mesInicial - 1]} a ${meses[mesFinal - 1]})`],
      [],
      encabezado,
      ...datos.map(d => [
        d.clave_covapa,
        d.vertiente,
        d.bene ?? 0,
        d.monto ?? 0
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    const nombreArchivo = `COVAPA_MyP_${anio}_${mesInicial}_${mesFinal}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);
  };

  return (
    <>
      <ScrollToTop />
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <RutaIndicadores id="covapa-myp" />
        <div className="containerTabla">
          <h2 className="TituloTabla">
            3 – Consulta COVAPAS por Mes y Periodo {anio} ({meses[mesInicial - 1]} a {meses[mesFinal - 1]})
          </h2>

          <div className="tablaConBoton">
            <div className="contenedorBotonTabla">
              <select
                value={mesInicial}
                onChange={(e) => {
                  const nuevoMes = Number(e.target.value);
                  setMesInicial(nuevoMes);
                  if (mesFinal < nuevoMes) setMesFinal(nuevoMes);
                }}
                className="selectorUniforme"
              >
                {meses.map((mes, i) => (
                  <option key={i + 1} value={i + 1}>{mes}</option>
                ))}
              </select>

              <select
                value={mesFinal}
                onChange={(e) => setMesFinal(Number(e.target.value))}
                className="selectorUniforme"
              >
                {meses.map((mes, i) => {
                  const mesNum = i + 1;
                  return mesNum >= mesInicial ? (
                    <option key={mesNum} value={mesNum}>{mes}</option>
                  ) : null;
                })}
              </select>

              <select
                value={anio}
                onChange={(e) => setAnio(Number(e.target.value))}
                className="selectorUniforme"
              >
                {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              <button
                onClick={copiarTablaComoHTML}
                className="botonCopiar botonUniforme"
                disabled={datos.length === 0}
              >
                Copiar tabla
              </button>
            </div>
          </div>

          {datos.length > 0 && (
            <div className="tablaScroll">
              <table className="tablaIndicadores">
                <thead>
                  <tr>
                    <th>Clave Covapa</th>
                    <th>Vertiente</th>
                    <th>Beneficiarios</th>
                    <th>Monto Asignado</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((d, i) => (
                    <tr key={i}>
                      <td>{d.clave_covapa}</td>
                      <td>{d.vertiente}</td>
                      <td>{d.bene ?? 0}</td>
                      <td>{d.monto != null ? d.monto.toLocaleString("es-MX") : "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {datos.length > 0 && (
            <div className="excelButton">
              <button onClick={exportarExcel} className="botonCopiar botonUniforme">
                Exportar a Excel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CovapaMyP;