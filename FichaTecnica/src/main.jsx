import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Lista from "./pages/Lista";
import BeneVertiente from "./pages/BeneVertiente";
import BeneVerEstadoMunicipio from "./pages/BeneVerEstadoMunicipio"; 
import CovapaMyP from "./pages/CovapaMyP";
import CovapaDetalle from "./pages/CovapaDetalle";
import FichaCyC from "./pages/FichaCyC";
import TexturaMenu from "/TexturaMenu.png";


const P404Page = () => (
  <div className="texturaFondo" style={{ backgroundImage: `url(${TexturaMenu})` }}>
    <h1>Página no encontrada</h1>
  </div>
);

const router = createHashRouter([
  {
    path: "/",
    element: <Lista />,
    errorElement: <P404Page />,
  },
  {
    path: "/reporte/cultura-cinematografia",
    element: <FichaCyC/>,
  },
  {
    path: "/reporte/bene-estado-municipio",
    element: <BeneVerEstadoMunicipio />,
  },
  {
    path: "/reporte/covapa-mes",
    element: <CovapaMyP />,
  },
  {
    path: "/reporte/covapa-detalle",
    element: <CovapaDetalle />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);