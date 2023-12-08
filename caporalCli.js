const CourseParser = require("./Parser");
const generateICalendar = require("./calendar");
const checkForOverlaps = require("./overlap");

const cli = require("@caporal/core").default;

cli
  .version("sru-cli")
  .version("1.0")

  .command("calendar", "Générer un calendrier iCalendar entre deux dates")
  .argument("<start>", "Date de début")
  .argument("<end>", "Date de fin")
  .argument("[filename]", "Le nom du fichier iCalendar", {
    default: "output.ics",
  })
  .action(({ args, options, logger }) => {
    const parser = new CourseParser();
    parser
      .getParsedCourses()
      .then((parsedCourses) => {
        generateICalendar(parsedCourses, args.start, args.end, args.filename);
      })
      .catch((err) => console.error(err));
  })

  .command("quality", "Vérifier la qualité des données d'emploi du temps")
  .action(({ args, options, logger }) => {
    const parser = new CourseParser();
    parser
      .getParsedCourses()
      .then((parsedCourses) => {
        let conflicts = checkForOverlaps(parsedCourses);
        if (conflicts.length !== 0) {
          logger.info("Voici les conflits trouvés :", conflicts);
        } else {
          logger.info("Pas de conflits trouvés. ");
        }
      })
      .catch((err) => console.error(err));
  })

  .command("data", "Retrieve all data into objects")
  .action(({ args, options, logger }) => {
    const parser = new CourseParser();
    parser
      .getParsedCourses()
      .then((parsedCourses) => {
        logger.info("Parsed courses : ", parsedCourses);
      })
      .catch((err) => console.error(err));
  });

cli.run(process.argv.slice(2));
