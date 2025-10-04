import { useParams, Link, useLocation } from "react-router-dom";
import "./ruta.css";

const RutaIndicadores = () => {
  const { pp } = useParams();
  const location = useLocation();

  return (
    <div className="contenedor_ruta_indicadores">
      <div className="c_r">
        <ol className="breadcrumb">
          <li>
            <Link to="/"><i className="">Inicio</i></Link>
          </li>

          {location.pathname.includes("/lista") && (
            <li><Link to="/lista">Registros</Link></li>
          )}

          {location.pathname.includes("/ficha") && pp && (
            <>
              <li><Link to="/lista">Registros</Link></li>
              <li><Link to={`/ficha/${pp}`}>Periodo</Link></li>
            </>
          )}
        </ol>
      </div>
    </div>
  );
};

export default RutaIndicadores;