import React from "react";
import ScrollToTop from "../components/ScrollToTop";
import RutaIndicadores from "../components/Ruta";
import integrantes from "../JSON/IntegrantesCultura.json";
import wordLogo from "../assets/Microsoft-Word-Logo.png";

const FichaCyCWord = () => {
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

  return (
    <>
      <ScrollToTop />
      <RutaIndicadores />
      <div className="containerTabla">
        <h2>Cultura y Cinematografía</h2>

        {presidente && (
          <>
            <h3>Presidenta</h3>
            <FichaCard persona={presidente} />
          </>
        )}

        {secretarios.length > 0 && (
          <>
            <h3>Secretarios</h3>
            {secretarios.map((persona, index) => (
              <FichaCard key={`sec-${index}`} persona={persona} />
            ))}
          </>
        )}

        {integrantesRestantes.length > 0 && (
          <>
            <h3>Integrantes</h3>
            {integrantesRestantes.map((persona, index) => (
              <FichaCard key={`int-${index}`} persona={persona} />
            ))}
          </>
        )}

        {/* Este botón no se exporta */}
        <img
          src={wordLogo}
          alt="Exportar a Word"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "90px",
            height: "50px",
            cursor: "pointer"
          }}
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

  const trayectoria = typeof t_administrativa === "string"
    ? t_administrativa.split("\n")
    : Array.isArray(t_administrativa) ? t_administrativa : [];

  return (
    <>
      <table style={{
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}>
        <tbody>
          <tr>
            <td style={{
              width: "240px",
              backgroundColor: "#f7f0f5",
              textAlign: "center"
            }}>
              <img src={`/${foto}`} alt={`Foto de ${nombre}`} />
            </td>
            <td>
              <div className="nombre">{nombre}</div>
              <ul>
                <li><span className="cargo">Cargo:</span> {cargo}</li>
                <li><span className="cargo">Grupo Parlamentario:</span> {grupo_parlamentario}</li>
                <li><span className="cargo">Escolaridad:</span> {escolaridad}</li>
                <li><span className="cargo">Preparación Académica:</span> {pre_academica}</li>
              </ul>

              {trayectoria.length > 0 && (
                <>
                  <h3 style={{ color: "#611232", marginBottom: "0.3rem" }}>
                    Trayectoria Administrativa
                  </h3>
                  <div style={{ marginLeft: "20px" }}>
                    <ul>
                      {trayectoria.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Separación real entre fichas */}
      <br /><br /><br />
    </>
  );
};

// ✅ Exportación modular para uso externo
export const exportarComoWordHTML = async () => {
  const container = document.querySelector(".containerTabla");
  if (!container) return;

  const clone = container.cloneNode(true);
  const boton = clone.querySelector("img[title='Exportar a Word']");
  if (boton) boton.remove();

  const imgElements = clone.querySelectorAll("img");
  const promises = Array.from(imgElements).map(img =>
    fetch(img.src)
      .then(res => res.blob())
      .then(blob => new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => {
          img.src = reader.result;
          resolve();
        };
        reader.readAsDataURL(blob);
      }))
      .catch(() => console.warn("No se pudo convertir la imagen:", img.src))
  );
  await Promise.all(promises);

  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>FichaCyC</title>
        <style>
          body {
            font-family: 'Noto Sans', sans-serif;
            color: #333;
            margin: 2rem;
          }
          h2, h3 {
            color: #611232;
            margin-bottom: 0.5rem;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1rem;
            page-break-inside: avoid;
          }
          td {
            vertical-align: top;
            border: 1px solid #ccc;
            padding: 8px;
            background-color: #fdfdfd;
          }
          img {
            width: 4.84cm;
            height: 6.32cm;
            object-fit: cover;
            display: block;
            margin-bottom: 0.5rem;
            border-radius: 40px;
          }
          ul {
            padding-left: 20px;
            margin: 4px 0;
          }
          li {
            margin-bottom: 4px;
            font-size: 14px;
          }
          .nombre {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #611232;
          }
          .cargo {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${clone.innerHTML}
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

export default FichaCyCWord;