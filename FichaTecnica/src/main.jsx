import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Lista from "./pages/Lista";
import FichaCyC from "./pages/FichaCyC";
import FichaRyT from "./pages/FichaRyT";
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
    path: "/reporte/Cultura-Cinematografia",
    element: <FichaCyC/>,
  },
  {
    path: "/reporte/Radio-TV",
    element: <FichaRyT/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);