const fs = require("fs");
const path = require("path");

/**
 * Fonction pour analyser le contenu d'un fichier .cru
 * @param {string} filePath - Chemin du fichier à analyser
 * @returns {Object[]} - Un tableau d'objets représentant les données analysées
 */
function parseCRUFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  const parsedData = [];
  let currentSection = null;

  lines.forEach((line) => {
    if (line.startsWith("+")) {
      // Début d'une nouvelle section
      currentSection = line.substring(1).trim();
    } else if (currentSection && line.trim()) {
      // Traitement des données de la section
      const data = parseDataLine(line);
      if (data) {
        parsedData.push({ section: currentSection, data });
      }
    }
  });

  return parsedData;
}

/**
 * Fonction pour analyser une ligne de données
 * @param {string} line - Ligne de données à analyser
 * @returns {Object|null} - Un objet représentant les données ou null si non analysable
 */
function parseDataLine(line) {
  // Séparation des composants de la ligne
  const components = line.split(",");

  // Assurer que la ligne contient suffisamment de composants
  if (components.length < 6) {
    return null;
  }

  // Extraction des données
  const courseId = components[0].trim();
  const courseType = components[1].trim();
  const participants = components[2].includes("=")
    ? components[2].split("=")[1].trim()
    : null;
  const timeInfo = components[3].split(" ");
  const day = timeInfo[0].includes("=")
    ? timeInfo[0].split("=")[1].trim()
    : null;
  const hours = timeInfo[1].trim();
  const frequency = components[4].includes("=")
    ? components[4].split("=")[1].trim()
    : null;
  const room = components[5].includes("=")
    ? components[5].split("=")[1].split("//")[0].trim()
    : null;

  return {
    courseId,
    courseType,
    participants,
    day,
    hours,
    frequency,
    room,
  };
}

// Exemple d'utilisation
const filePath = ".data/AB/edt.cru";
const parsedData = parseCRUFile(filePath);
console.log(parsedData);
