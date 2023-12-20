// Convertit le jour et l'heure en une date au format iCalendar
function convertToICSDate(day, time) {
  const days = ["L", "MA", "ME", "J", "V", "S", "D"];
  const startDate = new Date(); // Utiliser la date actuelle comme base
  startDate.setDate(
    startDate.getDate() + ((days.indexOf(day) - startDate.getDay() + 7) % 7)
  ); // Trouver le prochain jour spécifié

  const [hours, minutes] = time.split(":").map(Number);
  startDate.setHours(hours, minutes, 0); // Définir l'heure

  return startDate.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"; // Format iCalendar
}

function saveToFile(data, filename) {
  const fs = require("fs");
  const path = require("path");

  const directory = "calendar_files";
  const filePath = path.join(directory, filename + '.ics');

  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`${filePath} has been saved.`);
    }
  });
}

function filterSessions(parsedCourses, start_date, end_date) {
  let filteredSessions = [];
  parsedCourses.forEach((course) => {
    let sessions = course.getSessionsIn(start_date, end_date);
    if (sessions.length !== 0) {
      sessions.forEach((session) => filteredSessions.push(session));
    }
  });
  return filteredSessions;
}

function generateICalendar(parsedCourses, start_date, end_date, filename) {
  const sessions = filterSessions(parsedCourses, start_date, end_date);

  const icsEvents = sessions.map((session) => {
    let [start_time, end_time] = session.time.split("-");
    const startDate = convertToICSDate(session.day, start_time);
    const endDate = convertToICSDate(session.day, end_time);

    return `BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${session.type} Session ${session.num}
LOCATION:Room ${session.room}
DESCRIPTION:Capacity: ${session.capacity}
END:VEVENT`;
  });

  const icsCalendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UTT//Digital Dynasty//FR
${icsEvents.join("\n")}   
END:VCALENDAR`;
  saveToFile(icsCalendar, filename);
}

/* console.log(
  generateICalendar([
    new Session("1", 12, 20, "V", "09:00-16:00", 12, "ABBDD"),
    new Session("1", 12, 20, "J", "08:00-10:00", 12, "ABBDD"),
  ])
); */

module.exports = generateICalendar;
module.exports.convertToICSDate = convertToICSDate;
module.exports.saveToFile = saveToFile;
