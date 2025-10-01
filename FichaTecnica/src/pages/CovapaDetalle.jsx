import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ScrollToTop from "../components/ScrollToTop";
import RutaIndicadores from "../components/Ruta";
import "./ficha.css";
import TexturaMenu from "/TexturaMenu.png";

const CovapaDetalle = () => {
  const [searchParams] = useSearchParams();
  const claveInicial = searchParams.get("c") ?? "";

  const [claveCovapa, setClaveCovapa] = useState(claveInicial);
  const [claveSeleccionada, setClaveSeleccionada] = useState("");
  const [anioSeleccionado, setAnioSeleccionado] = useState("");
  const [clavesPorAnio, setClavesPorAnio] = useState([]);

  const [titulos, setTitulos] = useState([]);
  const [datosOriginales, setDatosOriginales] = useState([]);
  const [mensajeError, setMensajeError] = useState("");

  const extraerAnioDesdeClave = (clave) => {
    const partes = clave.split("-");
    const posibleAnio = partes[2];
    const anio = Number(posibleAnio);
    return anio >= 2019 && anio <= 2025 ? anio : null;
  };

  const consultarClave = async (clave) => {
    if (!clave.trim()) return;

    const anio = extraerAnioDesdeClave(clave);
    if (!anio) {
      setMensajeError("La clave COVAPA no es válida.");
      setTitulos([]);
      setDatosOriginales([]);
      return;
    }

    try {
      const catalogoRes = await fetch(`https://renic.cultura.gob.mx/fonart/gendatos/cat_covapa.php?a=${anio}`);
      const catalogo = await catalogoRes.json();
      const clavesValidas = catalogo.map(item => item.clave_covapa?.trim().toUpperCase());

      if (!clavesValidas.includes(clave.trim().toUpperCase())) {
        setMensajeError("La clave COVAPA no existe para el año indicado.");
        setTitulos([]);
        setDatosOriginales([]);
        return;
      }

      const datosRes = await fetch(`https://renic.cultura.gob.mx/fonart/gendatos/rcd.php?c=${clave}`);
      const json = await datosRes.json();
      const datos = json.datos ?? [];

      if (datos.length === 0) {
        setMensajeError("La clave COVAPA no tiene registros disponibles.");
        setTitulos([]);
        setDatosOriginales([]);
        return;
      }

      setMensajeError("");
      setTitulos(json.titulos);
      setDatosOriginales(datos);
      setClaveCovapa(clave);
    } catch (err) {
      console.error("Error al consultar clave:", err);
      setMensajeError("Hubo un error al consultar la clave.");
      setTitulos([]);
      setDatosOriginales([]);
    }
  };

  const cargarClavesPorAnio = async (anio) => {
    setClaveSeleccionada("");
    setClavesPorAnio([]);
    setAnioSeleccionado(anio);

    try {
      const res = await fetch(`https://renic.cultura.gob.mx/fonart/gendatos/cat_covapa.php?a=${anio}`);
      const json = await res.json();
      const claves = json.map(item => item.clave_covapa?.trim()).filter(Boolean);
      setClavesPorAnio(claves);
    } catch (err) {
      console.error("Error al cargar claves:", err);
    }
  };

  useEffect(() => {
    if (claveInicial) {
      consultarClave(claveInicial);
    }
  }, [claveInicial]);

  useEffect(() => {
    if (claveSeleccionada) {
      consultarClave(claveSeleccionada);
    }
  }, [claveSeleccionada]);

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
    const encabezado = titulos;
    const wsData = [
      [`Registros COVAPA – ${claveCovapa}`],
      [],
      encabezado,
      ...datosOriginales.map(registro => encabezado.map(t => registro[t] ?? ""))
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const totalCols = encabezado.length;
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    const nombreArchivo = `COVAPA_${claveCovapa.replace(/\s+/g, "_")}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);
  };

  return (
    <>
      <ScrollToTop />
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <RutaIndicadores />
        <div className="containerTabla">
          <h2 className="TituloTabla">
            Consulta COVAPA a detalle {claveCovapa && `– ${claveCovapa}`}
          </h2>

          <div className="tablaConBoton">
            <div className="contenedorBotonTabla">
              {/* Entrada manual */}
              <input
                type="text"
                value={claveCovapa}
                onChange={(e) => setClaveCovapa(e.target.value)}
                placeholder="Clave COVAPA"
                className="selectorUniforme"
              />

              <button
                onClick={() => consultarClave(claveCovapa)}
                className="botonCopiar botonUniforme"
                disabled={!claveCovapa.trim()}
              >
                Buscar
              </button>

              <div className="separadorVertical">|</div>
              {/* Selector de año */}
              <select
                value={anioSeleccionado}
                onChange={(e) => cargarClavesPorAnio(e.target.value)}
                className="selectorUniforme"
              >
                <option value="">Selecciona un año</option>
                {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              {/* Selector de clave por año */}
              {clavesPorAnio.length > 0 && (
                <select
                  value={claveSeleccionada}
                  onChange={(e) => setClaveSeleccionada(e.target.value)}
                  className="selectorUniforme"
                >
                  <option value="">Selecciona una clave</option>
                  {clavesPorAnio.map((clave, i) => (
                    <option key={i} value={clave}>{clave}</option>
                  ))}
                </select>
              )}

              <div className="separadorVertical">|</div>
              <button
                onClick={copiarTablaComoHTML}
                className="botonCopiar botonUniforme"
                disabled={datosOriginales.length === 0}
              >
                Copiar tabla
              </button>
            </div>
          </div>

          {mensajeError && (
            <p style={{ color: "red", fontWeight: "bold", marginTop: "1rem" }}>
              {mensajeError}
            </p>
          )}

          {datosOriginales.length > 0 && (
            <>
              <div className="tablaScroll">
                <table className="tablaIndicadores">
                  <thead>
                    <tr>
                      {titulos.map((titulo, i) => (
                        <th key={i}>{titulo}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {datosOriginales
                      .filter(d => (d.nombre ?? "").toString().trim().toUpperCase() !== "TOTAL")
                      .map((registro, i) => (
                        <tr key={i}>
                          {titulos.map((campo, j) => (
                            <td key={j}>
                              {registro[campo] != null
                                ? typeof registro[campo] === "number"
                                  ? registro[campo].toLocaleString("es-MX")
                                  : registro[campo]
                                : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              <div className="excelButton">
                <button
                  onClick={exportarExcel}
                  className="botonCopiar botonUniforme"
                >
                  Exportar a Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CovapaDetalle;
                 