function formatSessions(courses) {
  courses = courses.map((course) => {
    let sessions = course.sessions;
    sessions = sessions.map((session) => {
      let [start_date, end_date] = session.time.split("-");
      (session.start_time = start_date), (session.end_time = end_date);
      return session;
    });
    course.sessions = sessions;
    return course;
  });
  return courses;
}

const daysString = {
  L: "Lundi",
  MA: "Mardi",
  ME: "Mercredi",
  J: "Jeudi",
  V: "Vendredi",
  S: "Samedi",
  D: "Dimanche",
};

function parseTime(day, time) {
  const days = { L: 1, MA: 2, ME: 3, J: 4, V: 5, S: 6, D: 7 };
  const [hours, minutes] = time.split(":").map(Number);
  // Convert day and time to minutes from the start of the week
  return days[day] * 24 * 60 + hours * 60 + minutes;
}

function checkForOverlaps(courses) {
  courses = formatSessions(courses);
  let conflicts = [];

  // Iterate over all pairs of sessions in different courses
  for (let i = 0; i < courses.length; i++) {
    for (let j = 0; j < courses[i].sessions.length; j++) {
      let firstSession = courses[i].sessions[j];

      for (let k = i + 1; k < courses.length; k++) {
        for (let l = 0; l < courses[k].sessions.length; l++) {
          let secondSession = courses[k].sessions[l];

          if (firstSession.room === secondSession.room) {
            let firstStart = parseTime(
              firstSession.day,
              firstSession.start_time
            );
            let firstEnd = parseTime(firstSession.day, firstSession.end_time);
            let secondStart = parseTime(
              secondSession.day,
              secondSession.start_time
            );
            let secondEnd = parseTime(
              secondSession.day,
              secondSession.end_time
            );

            if (firstStart < secondEnd && secondStart < firstEnd) {
              conflicts.push(
                `Conflit entre ${courses[i].code} (${firstSession.time}) et ${
                  courses[k].code
                } (${secondSession.time}) dans la salle ${
                  firstSession.room
                } le ${daysString[firstSession.day]}`
              );
            }
          }
        }
      }
    }
  }

  return conflicts;
}

module.exports = checkForOverlaps;
module.exports.parseTime = parseTime;
module.exports.checkForOverlaps = checkForOverlaps;
