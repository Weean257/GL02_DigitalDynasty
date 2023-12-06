// CourseFunctions.js

const CourseParser = require("./Parser");

// Fonction pour obtenir les salles associées à un cours (spec 1)

async function getSalles(cours, logger) {
  // Créer une instance de CourseParser
  const courseParser = new CourseParser();

  // Obtenir les cours parsés à partir des fichiers dans le répertoire spécifié
  const parsedCourses = await courseParser.getParsedCourses();
 

  // Rechercher le cours spécifié
  const upperCaseTarget = cours && cours.toUpperCase(); // Vérifier que cours est défini avant d'appeler toUpperCase

  let selectedCourse = null;
  for (const course of parsedCourses) {
    if (course.code && upperCaseTarget && course.code.toUpperCase() === upperCaseTarget) {
      selectedCourse = course;
      break;
    }
  }
  if (selectedCourse) {
    // Afficher les salles associées au cours
    selectedCourse.sessions.forEach(session => {

    
      logger.info(`La salle pour le cours ${cours} qui à lieu le ${session.day} à ${session.time} est : ${session.room}`);
    });
  } else {
    logger.error(`Le cours "${cours}" n'a pas été trouvé.`);
  }
}
// Fonction pour récupérer les capacités maximales d'une salle ( spec 2)
async function getCapacite(salle, logger) {

  // Créer une instance de CourseParser
  const courseParser = new CourseParser();

  // Obtenir les cours parsés à partir des fichiers dans le répertoire spécifié
  const parsedCourses = await courseParser.getParsedCourses();
 
  // Rechercher la salle spécifiée
  const selectedSalle = salle.toLowerCase(); // Convertir en minuscules pour la recherche insensible à la casse
   
  let salleCapacite = null;

  for (const course of parsedCourses) {
    for (const session of course.sessions) {
      if (session.room.toLowerCase() === selectedSalle) {
        salleCapacite = session.capacity;
        break;
      }
    }
    if (salleCapacite !== null) {
      break;
    }
  }

  if (salleCapacite !== null) {
    logger.info(`Capacité maximale de la salle "${salle}": ${salleCapacite}`);
  } else {
    logger.err(`La salle "${salle}" n'a pas été trouvée.`);
  }
}

module.exports = {
  getSalles,
  getCapacite,
};