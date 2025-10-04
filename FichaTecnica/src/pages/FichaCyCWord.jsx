// Importa React para poder usar JSX y componentes
import React from "react";

// Importa el componente que fuerza el scroll al inicio al montar la vista
import ScrollToTop from "../components/ScrollToTop";

// Importa el componente que muestra la ruta de navegación institucional
import RutaIndicadores from "../components/Ruta";

// Importa el archivo JSON con los datos de las personas (nombre, cargo, foto, etc.)
import integrantes from "../JSON/IntegrantesCultura.json";

// Importa el logo de Word que se usará como botón de exportación
import wordLogo from "../assets/Microsoft-Word-Logo.png";

// Componente principal que renderiza todas las fichas y el botón de exportar
const FichaCyCWord = () => {
  // Función auxiliar para normalizar texto: minúsculas y sin espacios
  const normalizar = texto => texto?.toLowerCase().trim();

  // Busca la primera persona cuyo cargo incluya "presidenta" o "presidente"
  const presidente = integrantes.find(p =>
    normalizar(p.cargo).includes("presidenta") || normalizar(p.cargo).includes("presidente")
  );

  // Filtra todas las personas cuyo cargo incluya "secretaria" o "secretario"
  const secretarios = integrantes.filter(p =>
    normalizar(p.cargo).includes("secretaria") || normalizar(p.cargo).includes("secretario")
  );

  // Filtra todas las personas cuyo cargo sea exactamente "integrante"
  const integrantesRestantes = integrantes.filter(p =>
    normalizar(p.cargo) === "integrante"
  );

  // Renderiza la vista completa
  return (
    <>
      {/* Componente que fuerza scroll al inicio */}
      <ScrollToTop />

      {/* Componente que muestra la ruta de navegación */}
      <RutaIndicadores />

      {/* Contenedor principal de las fichas */}
      <div className="containerTabla">
        <h2>Cultura y Cinematografía</h2>

        {/* Renderiza la ficha de la presidenta si existe */}
        {presidente && (
          <>
            <h3>Presidenta</h3>
            <FichaCard persona={presidente} />
          </>
        )}

        {/* Renderiza todas las fichas de secretarios si hay al menos uno */}
        {secretarios.length > 0 && (
          <>
            <h3>Secretarios</h3>
            {secretarios.map((persona, index) => (
              <FichaCard key={`sec-${index}`} persona={persona} />
            ))}
          </>
        )}

        {/* Renderiza todas las fichas de integrantes restantes */}
        {integrantesRestantes.length > 0 && (
          <>
            <h3>Integrantes</h3>
            {integrantesRestantes.map((persona, index) => (
              <FichaCard key={`int-${index}`} persona={persona} />
            ))}
          </>
        )}

        {/* Botón fijo en pantalla para exportar a Word (no se incluye en el documento exportado) */}
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

// Componente que renderiza una ficha individual
const FichaCard = ({ persona }) => {
  // Desestructura los datos de la persona
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

  // Convierte la trayectoria administrativa en array si es string
  const trayectoria = typeof t_administrativa === "string"
    ? t_administrativa.split("\n")
    : Array.isArray(t_administrativa) ? t_administrativa : [];

  // Renderiza la ficha

   // Convierte las iniciativas en array si es string
  const iniciativas = typeof iniciativa === "string"
    ? iniciativa.split("\n")
    : Array.isArray(iniciativa) ? iniciativa : [];

  // Renderiza la ficha
  return (
    <>
      <table style={{
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}>
        <tbody>
          <tr>
            {/* Columna de la imagen */}
            <td style={{
              width: "240px",
              backgroundColor: "#f7f0f5",
              textAlign: "center"
            }}>
              <img src={`/${foto}`} alt={`Foto de ${nombre}`} />
            </td>

            {/* Columna de los datos */}
            <td>
              <div className="nombre">{nombre}</div>
              <ul>
                <li><span className="cargo">Cargo:</span> {cargo}</li>
                <li><span className="cargo">Grupo Parlamentario:</span> {grupo_parlamentario}</li>
                <li><span className="cargo">Escolaridad:</span> {escolaridad}</li>
                <li><span className="cargo">Preparación Académica:</span> {pre_academica}</li>
              </ul>

              {/* Si hay trayectoria, se muestra como lista */}
              <br />
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
              <br />
              {/* Si hay iniciativa, se muestra como lista */}
              {iniciativas.length > 0 && (
                <>
                  <h3 style={{ color: "#611232", marginBottom: "0.3rem" }}>
                    Iniciativas Presentadas
                  </h3>
                  <div style={{ marginLeft: "20px" }}>
                    <ul>
                      {iniciativas.map((item, i) => (
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

      {/* Separación visual entre fichas (no afecta exportación) */}
      <br /><br /><br />
    </>
  );
};

// Función que exporta el contenido como documento Word
export const exportarComoWordHTML = async () => {
  // Busca el contenedor principal de las fichas
  const container = document.querySelector(".containerTabla");
  if (!container) return;

  // Clona el contenido para manipularlo sin afectar la vista
  const clone = container.cloneNode(true);

  // Elimina el botón de exportar del clon
  const boton = clone.querySelector("img[title='Exportar a Word']");
  if (boton) boton.remove();

  // Convierte todas las imágenes a base64 para que Word las incluya correctamente
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

  // Construye el HTML completo para el documento Word
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
            font-size: 11px;
          }
          .nombre {
            font-size: 15px;
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

  // Crea el archivo Word como blob y lo descarga
  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "FichaCyC.doc";
  link.click();
  URL.revokeObjectURL(link.href);
};

// Exporta el componente principal para que pueda usarse en otras partes del sistema
export default FichaCyCWord;