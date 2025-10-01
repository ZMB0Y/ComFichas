import { Link, useLocation } from "react-router-dom";
import "./ruta.css";

const RutaIndicadores = () => {
  const location = useLocation();
  const path = location.pathname;

  let nombreRegistro = null;

  // Diccionario de reportes
  const nombresReportes = {
  "/reporte/Cultura-Cinematografia":"Cultura-Cinematografia" ,
  "/reporte/bene-vertiente": "Beneficiarios por vertiente",
  "/reporte/bene-vertiente-municipio": "Beneficiarios por vertiente Estado y municipio",
  "/reporte/bene-estado-municipio": "Beneficiarios por vertiente Estado y municipio",
  "/reporte/covapa-mes": "Consulta COVAPAS por Mes y Periodo",
  "/reporte/covapa-detalle": "Consulta COVAPA a detalle",
  /* "/reporte/exportar-csv": "Exportar Registros Capturados a CSV",
  "/reporte/exportar-csv-mes": "Exportar Registros capturados a CSV por Mes" */
};

  if (nombresReportes[path]) {
    nombreRegistro = nombresReportes[path];
  }

  return (
    <div
      className="contenedor_ruta_indicadores"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#fff",
        padding: "10px 0"
      }}
    >
      <div className="c_r">
        <ol className="breadcrumb">
          <li>
            <Link to="/">Comisiones</Link>
          </li>

        {/*   {path.startsWith("/lista") || path.startsWith("/reporte") ? (
            <li><Link to="/lista">Registro</Link></li>
          ) : null} */}

          {nombreRegistro && (
            <li><Link to={path}>{nombreRegistro}</Link></li>
          )}
        </ol>
      </div>
    </div>
  );
};

export default RutaIndicadores;
