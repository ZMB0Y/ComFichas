import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ScrollToTop from "../components/ScrollToTop";
import "./ficha.css";
import TexturaMenu from "/TexturaMenu.png";
import Ruta from "../components/Ruta";

const Ficha = () => {
  const { pp } = useParams();
  const index = parseInt(pp, 10);

  const [data, setData] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("Nacional");

  useEffect(() => {
    fetch("/listaScaps.json")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setEstadoSeleccionado("Nacional"); // inicializamos con Nacional
      })
      .catch(err => console.error("Error al cargar listaScaps.json:", err));
  }, []);

  if (!data) {
    return (
      <div className="containerTabla">
        <p>Cargando datos de la vertiente...</p>
      </div>
    );
  }

  if (isNaN(index) || index < 0 || index >= data.vertientes.length) {
    return (
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <ScrollToTop />
        <div className="containerTabla">
          <h2 className="TituloTablaError">Vertiente no encontrada</h2>
        </div>
      </div>
    );
  }

  const vertiente = data.vertientes[index];

  const entidadesMostradas =
    estadoSeleccionado === "Nacional"
      ? data.datos
      : data.datos.filter(d => d.entidad === estadoSeleccionado);

  const mostrarTitulo = estadoSeleccionado === "Nacional" ? "Nacional" : entidadesMostradas[0]?.entidad ?? "";

  // ----------------- Copiar tabla al portapapeles -----------------
  const copiarTabla = () => {
    const filas = entidadesMostradas.map(entidadItem => {
      const datosVertienteItem = entidadItem[`v${index}`];
      return `${entidadItem.entidad}\t${vertiente}\t${datosVertienteItem?.bene ?? 0}\t${datosVertienteItem?.monto ?? 0}`;
    }).join("\n");

    const texto = "Entidad\tVertiente\tBeneficiarios\tMonto\n" + filas;

    const textarea = document.createElement("textarea");
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("No se pudo copiar la tabla:", err);
    }
    document.body.removeChild(textarea);
  };

  // ----------------- Exportar a Excel -----------------
  const exportarExcel = () => {
    const wsData = [
      [mostrarTitulo + " - " + vertiente],
      [],
      ["Entidad", "Vertiente", "Beneficiarios", "Monto"],
      ...entidadesMostradas.map(entidadItem => {
        const datosVertienteItem = entidadItem[`v${index}`];
        return [
          entidadItem.entidad,
          vertiente,
          datosVertienteItem?.bene ?? 0,
          datosVertienteItem?.monto ?? 0
        ];
      })
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Nombre personalizado del archivo
    const nombreArchivo = `${mostrarTitulo.replace(/\s+/g, "_")}_${vertiente.replace(/\s+/g, "_")}.xlsx`;

    saveAs(new Blob([wbout], { type: "application/octet-stream" }), nombreArchivo);
  };

  return (
    <>
      <ScrollToTop />
      <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
        <Ruta pp={pp} />
        <div className="containerTabla">
          <h2 className="TituloTabla">{mostrarTitulo} - {vertiente}</h2>

          <div className="tablaConBoton">
            <div className="contenedorBotonTabla">
              <select
                value={estadoSeleccionado}
                onChange={(e) => setEstadoSeleccionado(e.target.value)}
                className="selectorEstado"
                style={{
                  padding: "6px",
                  fontSize: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontFamily: "Noto Sans",
                  minWidth: "220px"
                }}
              >
                <option value="Nacional">Nacional</option>
                {data.datos.map((d, i) => (
                  <option key={i} value={d.entidad}>{d.entidad}</option>
                ))}
              </select>

              <button onClick={copiarTabla} className="botonCopiar botonUniforme">
                Copiar tabla
              </button>

            </div>
          </div>

          <div className="tablaScroll">
            {entidadesMostradas.length > 0 ? (
              <table className="tablaIndicadores">
                <thead>
                  <tr>
                    <th>Entidad</th>
                    <th>Vertiente</th>
                    <th>Beneficiarios</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {entidadesMostradas.map((entidadItem, i) => {
                    const datosVertienteItem = entidadItem[`v${index}`];
                    return (
                      <tr key={i}>
                        <td>{entidadItem.entidad}</td>
                        <td>{vertiente}</td>
                        <td>{datosVertienteItem?.bene ?? 0}</td>
                        <td>{datosVertienteItem?.monto != null ? datosVertienteItem.monto.toLocaleString("es-MX") : "0"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="mensajeErrorFicha">
                Sin asignación registrada en esta vertiente para la entidad seleccionada.
              </div>
            )}
          </div>
          <div className="excelButton">
            <button onClick={exportarExcel} className="botonCopiar botonUniforme">Exportar a Excel</button>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Ficha;
