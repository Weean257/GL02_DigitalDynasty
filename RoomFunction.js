const CourseParser = require("./Parser")

//Function pour convertir le temps qui est une chaîne de caractère en un tableau d'entiers
function changeTime (hour){
  let plage = hour.split('-');
  let trueHourD = plage[0].split(':');
  let trueHourF = plage[1].split(':');
  let heureDeDebut = new Date();
  heureDeDebut.setHours(trueHourD[0], trueHourD[1], 0);
  let heureDeFin = new Date();
  heureDeFin.setHours(trueHourF[0], trueHourF[1], 0);
  let newTime = [];
  newTime.push(heureDeDebut);
  newTime.push(heureDeFin);
  return newTime;
}
//SPEC_4 Fonction pour obtenir le salles associées à un créneau donné
function getRoom (hour,day,logger){
  const courseParser = new CourseParser();
  const parsedCourses = courseParser.getParsedCourses();
  let hourUser = changeTime(hour);
  let test = 0;
  parsedCourses.then((parsedCourses) => {
   for (let i = 0; i<parsedCourses.length; i++){
     for (let j = 0; j<parsedCourses[i].sessions.length; j++){
        let hourSes = changeTime(parsedCourses[i].sessions[j].time);
       if ((hourSes[0]>=hourUser[1] || hourSes[1]<=hourUser[0]) && day != parsedCourses[i].sessions[j].day){
        logger.info (`Au jour de ${parsedCourses[i].sessions[j].day} et à ${parsedCourses[i].sessions[j].time} la salle ${parsedCourses[i].sessions[j].room} est libre`)
        test = 1;
       }
      }
    }
    if (test === 0){
      logger.info('Aucune salle libre trouvée');
    }

  })
  .catch((err) => console.error(err));
  
}

//SPEC_3 Fonction pour afficher pour une salle donnée les créneaux auxquels elle sera libre.
function getHour(room,logger){
  const courseParser = new CourseParser();
  const parsedCourses = courseParser.getParsedCourses();
  let test = 0;
  parsedCourses.then((parsedCourses) => {
   for (let i = 0; i <parsedCourses.length; i++){
     for (let j = 0; j<parsedCourses[i].sessions.length; j++){
       if (room != parsedCourses[i].sessions[j].room){
        logger.info (`La salle ${room} sera libre au jour du ${parsedCourses[i].sessions[j].day} et à ${parsedCourses[i].sessions[j].time} `)
        test = 1;
       }
      }
    }
    if (test === 0){
      logger.info('Cette salle est occupée toute la semaine');
    }

  })
  .catch((err) => console.error(err));
  
}

module.exports.getRoom = getRoom;
module.exports.getHour = getHour;