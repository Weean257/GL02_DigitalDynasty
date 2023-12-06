const CourseParser = require("./Parser")

.command("spec_1", "Voir à quel moment de la semaine une certaine salle est libre")
  .action(({ args, options, logger, hour: string }) => {
    const parser1 = new CourseParser();
    parser
      .getParsedCourses()
      .then((parsedCourses) => {
        for (let i = 0; i < length.parsedCourses; i++) {
          let freeHour = parsedCourses[i];
          if (hour != freeHour.sessions.time) {
            logger.info("salles libres : ", room);

          }
        }
      })
      .catch((err) => console.error(err));


  });
