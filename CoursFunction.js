// CourseFunctions.js

const CourseParser = require("./Parser");

// Fonction pour obtenir les cours parsés
async function getParsedCourses() {
  const courseParser = new CourseParser();
  return await courseParser.getParsedCourses();
}

// Fonction pour obtenir les salles associées à un cours (spec 1)
async function getSalles(cours) {
  const parsedCourses = await getParsedCourses();
  const upperCaseTarget = cours && cours.toUpperCase();

  // Créer un index des cours pour accélérer la recherche
  const courseIndex = {};
  parsedCourses.forEach((course) => {
    if (course.code) {
      courseIndex[course.code.toUpperCase()] = course.sessions;
    }
  });

  // Rechercher le cours spécifié dans l'index
  const selectedCourseSessions = courseIndex[upperCaseTarget] || null;

  return selectedCourseSessions;
}

// Fonction pour récupérer les capacités maximales d'une salle (spec 2)
async function getCapacite(salle, logger) {
  const parsedCourses = await getParsedCourses();
  const selectedSalle = salle.toLowerCase();

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

  return salleCapacite;
}

module.exports = {
  getSalles,
  getCapacite,
};
