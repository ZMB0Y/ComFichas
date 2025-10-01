import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import RutaIndicadores from "../components/Ruta";
import "./ficha.css";
import integrantes from "../JSON/IntegrantesCultura.json";
import wordLogo from "../assets/Microsoft-Word-Logo.png";
import texturaFondo from "../assets/TexturaMenu.png";

const FichaCyC = () => {
  const normalizar = texto => texto?.toLowerCase().trim();

  const presidente = integrantes.find(p =>
    normalizar(p.cargo).includes("presidenta") || normalizar(p.cargo).includes("presidente")
  );

  const secretarios = integrantes.filter(p =>
    normalizar(p.cargo).includes("secretaria") || normalizar(p.cargo).includes("secretario")
  );

  const integrantesRestantes = integrantes.filter(p =>
    normalizar(p.cargo) === "integrante"
  );

  const exportarComoWordHTML = async () => {
    const container = document.querySelector(".containerTabla");
    if (!container) return;

    const imgElements = container.querySelectorAll("img");

    const promises = Array.from(imgElements).map(async img => {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => {
            img.src = reader.result;
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.warn("No se pudo convertir la imagen:", img.src);
      }
    });

    await Promise.all(promises);

    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>FichaCyC</title>
          <style>
            body { font-family: 'Noto Sans', sans-serif; color: #333; }
            h2, h3 { color: #611232; }
            .fichaCyC-card { border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem; }
            .fichaCyC-nombre { font-size: 1.4rem; font-weight: bold; margin-bottom: 0.5rem; }
            .fichaCyC-lista { list-style: none; padding: 0; }
            .fichaCyC-lista li { margin-bottom: 0.3rem; }
            .fichaCyC-sublista { margin-top: 0.5rem; padding-left: 1rem; }
            img { max-width: 100%; height: auto; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          ${container.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "FichaCyC.doc";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <ScrollToTop />
      <RutaIndicadores />
      <div className="containerTabla">
        <h2 className="TituloTabla2">Cultura y Cinematografía</h2>

        {presidente && (
          <>
            <h3 className="TituloTabla">Presidenta</h3>
            <hr className="red" />
            <div className="filaFichas">
              <FichaCard persona={presidente} />
            </div>
          </>
        )}

        {secretarios.length > 0 && (
          <>
            <h3 className="TituloTabla">Secretarios</h3>
            <hr className="red" />
            <div className="filaFichas">
              {secretarios.map((persona, index) => (
                <FichaCard key={`sec-${index}`} persona={persona} />
              ))}
            </div>
          </>
        )}

        {integrantesRestantes.length > 0 && (
          <>
            <h3 className="TituloTabla">Integrantes</h3>
            <hr className="red" />
            <div className="filaFichas">
              {integrantesRestantes.map((persona, index) => (
                <FichaCard key={`int-${index}`} persona={persona} />
              ))}
            </div>
          </>
        )}

        <img
          src={wordLogo}
          alt="Exportar a Word"
          className="botonExportarFijo"
          title="Exportar a Word"
          onClick={exportarComoWordHTML}
        />
      </div>
    </>
  );
};

const FichaCard = ({ persona }) => {
  const {
    nombre,
    cargo,
    grupo_parlamentario,
    escolaridad,
    pre_academica,
    t_administrativa,
    foto
  } = persona;

  const [mostrarTrayectoria, setMostrarTrayectoria] = useState(false);

  const trayectoria = (() => {
    if (typeof t_administrativa === "string") {
      return t_administrativa.split("\n");
    }
    if (Array.isArray(t_administrativa)) {
      return t_administrativa;
    }
    return [];
  })();

  return (
    <div
      className="fichaCyC-card"
      style={{
        backgroundImage: `url(${texturaFondo})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      <div className="fichaCyC-imagen">
        <img src={`/${foto}`} alt={`Foto de ${nombre}`} />
      </div>

      <div className="fichaCyC-datos">
        <h3 className="fichaCyC-nombre">{nombre}</h3>

        <ul className="fichaCyC-lista">
          <li><strong>Cargo:</strong> {cargo}</li>
          <li><strong>Grupo Parlamentario:</strong> {grupo_parlamentario}</li>
          <li><strong>Escolaridad:</strong> {escolaridad}</li>
          <li><strong>Preparación Académica:</strong> {pre_academica}</li>
        </ul>

        {trayectoria.length > 0 && (
          <div className="trayectoriaContenedor">
            <button
              className="botonTrayectoria"
              onClick={() => setMostrarTrayectoria(prev => !prev)}
            >
              {mostrarTrayectoria ? "Ocultar trayectoria" : "Trayectoria Administrativa"}
            </button>

            <div className={`trayectoriaCortina ${mostrarTrayectoria ? "abierta" : ""}`}>
              <ul className="fichaCyC-sublista">
                {trayectoria.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FichaCyC;