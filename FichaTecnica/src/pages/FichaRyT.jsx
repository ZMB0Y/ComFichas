import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import RutaIndicadores from "../components/Ruta";
import "./ficha.css";
import integrantes from "../JSON/IntegrantesRyT.json";
import wordLogo from "../assets/Microsoft-Word-Logo.png";
import texturaFondo from "../assets/TexturaMenu.png";
import { exportarComoWordHTML } from "./FichaRyTWord";

const FichaRyT = () => {
  // Estado que guarda qué panel está activo y de quién
  const [panelActivo, setPanelActivo] = useState({ nombre: null, tipo: null });

  const normalizar = texto => texto?.toLowerCase().trim();

  const presidente = integrantes.find(p =>
    normalizar(p.cargo).includes("presidente")
  );

  const secretarios = integrantes.filter(p =>
    normalizar(p.cargo).includes("secretaria") || normalizar(p.cargo).includes("secretario")
  );

  const integrantesRestantes = integrantes.filter(p =>
    normalizar(p.cargo) === "integrante"
  );

  return (
    <>
      <ScrollToTop />
      <RutaIndicadores />
      <div className="containerTabla">
        <h2 className="TituloTabla2">Cultura y Cinematografía</h2>

        {presidente && (
          <>
            <h3 className="TituloTabla">Presidente</h3>
            <hr className="red" />
            <div className="filaFichas">
              <FichaCard
                persona={presidente}
                panelActivo={panelActivo}
                activar={(tipo) =>
                  setPanelActivo(prev =>
                    prev.nombre === presidente.nombre && prev.tipo === tipo
                      ? { nombre: null, tipo: null }
                      : { nombre: presidente.nombre, tipo }
                  )
                }
              />
            </div>
          </>
        )}

        {secretarios.length > 0 && (
          <>
            <h3 className="TituloTabla">Secretarios</h3>
            <hr className="red" />
            <div className="filaFichas">
              {secretarios.map((persona, index) => (
                <FichaCard
                  key={`sec-${index}`}
                  persona={persona}
                  panelActivo={panelActivo}
                  activar={(tipo) =>
                    setPanelActivo(prev =>
                      prev.nombre === persona.nombre && prev.tipo === tipo
                        ? { nombre: null, tipo: null }
                        : { nombre: persona.nombre, tipo }
                    )
                  }
                />
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
                <FichaCard
                  key={`int-${index}`}
                  persona={persona}
                  panelActivo={panelActivo}
                  activar={(tipo) =>
                    setPanelActivo(prev =>
                      prev.nombre === persona.nombre && prev.tipo === tipo
                        ? { nombre: null, tipo: null }
                        : { nombre: persona.nombre, tipo }
                    )
                  }
                />
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

const FichaCard = ({ persona, panelActivo, activar }) => {
  const {
    nombre,
    cargo,
    grupo_parlamentario,
    escolaridad,
    pre_academica,
    t_administrativa,
    iniciativa,
    foto
  } = persona;

  const trayectoria = Array.isArray(t_administrativa)
    ? t_administrativa
    : typeof t_administrativa === "string"
    ? t_administrativa.split("\n")
    : [];

  const iniciativas = Array.isArray(iniciativa)
    ? iniciativa
    : typeof iniciativa === "string"
    ? iniciativa.split("\n")
    : [];

  const mostrarTrayectoria = panelActivo.nombre === nombre && panelActivo.tipo === "trayectoria";
  const mostrarIniciativa = panelActivo.nombre === nombre && panelActivo.tipo === "iniciativa";

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
            <button className="botonTrayectoria" onClick={() => activar("trayectoria")}>
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

        {iniciativas.length > 0 && (
          <div className="trayectoriaContenedor">
            <button className="botonTrayectoria" onClick={() => activar("iniciativa")}>
              {mostrarIniciativa ? "Ocultar Iniciativa" : "Iniciativas"}
            </button>

            <div className={`trayectoriaCortina ${mostrarIniciativa ? "abierta" : ""}`}>
              <ul className="fichaCyC-sublista">
                {iniciativas.map((item, index) => (
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

export default FichaRyT;