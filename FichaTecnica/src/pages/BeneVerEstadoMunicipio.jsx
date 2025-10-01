import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ScrollToTop from "../components/ScrollToTop";
import RutaIndicadores from "../components/Ruta";
import "./ficha.css";
import TexturaMenu from "/TexturaMenu.png";

const BeneVerEstadoMunicipio = () => {
  const [estadoId, setEstadoId] = useState("1"); // Estado inicial por defecto
  const [anio, setAnio] = useState(2024);
  const [mesInicial, setMesInicial] = useState(1);
  const [mesFinal, setMesFinal] = useState(12);
  const [data, setData] = useState(null);
  const [estadosDisponibles, setEstadosDisponibles] = useState([]);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Cargar lista de estados desde repbv.php
  useEffect(() => {
    fetch(`https://renic.cultura.gob.mx/fonart/gendatos/repbv.php?e=0&m1=${mesInicial}&m2=${mesFinal}&a=${anio}`)
      .then(res => res.json())
      .then(json => {
        const entidades = [...new Set(json.datos.map(d => d.entidad))].filter(e => e !== "Total");
        setEstadosDisponibles(entidades);
      })
      .catch(err => console.error("Error al cargar lista de estados:", err));
  }, [anio, mesInicial, mesFinal]);

  // Cargar datos del estado seleccionado desde repbvm.php
  useEffect(() => {
    fetch(`https://renic.cultura.gob.mx/fonart/gendatos/repbvm.php?e=${estadoId}&m1=${mesInicial}&m2=${mesFinal}&a=${anio}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error al cargar datos del estado:", err));
  }, [estadoId, anio, mesInicial, mesFinal]);

  if (!data) {
    return <div className="containerTabla"><p>Cargando datos...</p></div>;
  }

  const clavesVertientes = data.vertientes.map((_, i) => `v${i}`);
  const registrosMostrados = data.datos.filter(d => d.municipio !== "Total");
  const mostrarTitulo = data.estado;

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
    const encabezado = ["Clave", "Municipio"];
    clavesVertientes.forEach((v, i) => {
      encabezado.push(`${data.vertientes[i]} - Beneficiarios`);
      encabezado.push(`${data.vertientes[i]} - Monto`);
    });
    encabezado.push("Total General - Beneficiarios", "Total General - Monto");

    const wsData = [
      [`${mostrarTitulo} – Beneficiarios por vertiente ${anio} (${meses[mesInicial - 1]} a ${meses[mesFinal - 1]})`],
      [],
      encabezado,
      ...registrosMostrados.map(registro => {
        const fila = [registro.clave, registro.municipio];
        clavesVertientes.forEach(v => {
          fila.push(registro[v]?.bene ?? 0);
          fila.push(registro[v]?.monto ?? 0);
        });
        fila.push(registro.vt?.bene ?? 0);
        fila.push(registro.vt?.monto ?? 0);
        return fila;
      })
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const totalCols = encabezado.length;
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    const nombreArchivo = `${mostrarTitulo.replace(/\s+/g, "_")}_Beneficiarios_${anio}_${mesInicial}_${mesFinal}.xlsx`;
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
            {mostrarTitulo} – Beneficiarios por vertiente {anio} ({meses[mesInicial - 1]} a {meses[mesFinal - 1]})
          </h2>

          <div className="tablaConBoton">
            <div className="contenedorBotonTabla">
              {/* Selector de estado dinámico */}
              <select
                value={estadoId}
                onChange={(e) => setEstadoId(e.target.value)}
                className="selectorUniforme"
              >
                {estadosDisponibles.map((estado, i) => (
                  <option key={i + 1} value={i + 1}>{estado}</option>
                ))}
              </select>

              {/* Mes inicial */}
              <select
                value={mesInicial}
                onChange={(e) => {
                  const nuevoMesInicial = Number(e.target.value);
                  setMesInicial(nuevoMesInicial);
                  if (mesFinal < nuevoMesInicial) {
                    setMesFinal(nuevoMesInicial);
                  }
                }}
                className="selectorUniforme"
              >
                {meses.map((mes, i) => (
                  <option key={i + 1} value={i + 1}>{mes}</option>
                ))}
              </select>

              {/* Mes final */}
              <select
                value={mesFinal}
                onChange={(e) => setMesFinal(Number(e.target.value))}
                className="selectorUniforme"
              >
                {meses.map((mes, i) => {
                  const mesNumero = i + 1;
                  return mesNumero >= mesInicial ? (
                    <option key={mesNumero} value={mesNumero}>{mes}</option>
                  ) : null;
                })}
              </select>

              {/* Año */}
              <select
                value={anio}
                onChange={(e) => setAnio(Number(e.target.value))}
                className="selectorUniforme"
              >
                {[...Array(7)].map((_, i) => {
                  const year = 2019 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>

              <button onClick={copiarTablaComoHTML} className="botonCopiar botonUniforme">
                Copiar tabla
              </button>
            </div>
          </div>
                    <div className="tablaScroll">
            <table className="tablaIndicadores">
              <thead>
                <tr>
                  <th rowSpan="2">Clave</th>
                  <th rowSpan="2">Municipio</th>
                  {data.vertientes.map((nombre, i) => (
                    <th key={i} colSpan="2">{nombre}</th>
                  ))}
                  <th colSpan="2">Total General</th>
                </tr>
                <tr>
                  {[...clavesVertientes, "vt"].map((v, i) => (
                    <>
                      <th key={`bene-${v}`}>Beneficiarios</th>
                      <th key={`monto-${v}`}>Monto</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registrosMostrados.map((registro, i) => (
                  <tr key={i}>
                    <td>{registro.clave}</td>
                    <td>{registro.municipio}</td>
                    {clavesVertientes.map(v => (
                      <>
                        <td>{registro[v]?.bene ?? 0}</td>
                        <td>{registro[v]?.monto != null ? registro[v].monto.toLocaleString("es-MX") : "0"}</td>
                      </>
                    ))}
                    <td>{registro.vt?.bene ?? 0}</td>
                    <td>{registro.vt?.monto != null ? registro.vt.monto.toLocaleString("es-MX") : "0"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="excelButton">
            <button onClick={exportarExcel} className="botonCopiar botonUniforme">
              Exportar a Excel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BeneVerEstadoMunicipio;