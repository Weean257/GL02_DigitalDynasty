const CourseParser = require("./Parser");
const generateICalendar = require("./calendar");
const checkForOverlaps = require("./overlap");
const { getCapacite, getSalles } = require("./CoursFunction");

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

  // Obtenir les salles grace au code du cours (Specification 1)
  .command("salles", "Obtenir les salles associées a un cours donné")
  .argument("<nomCours>", "Nom du cours ")

  .action(async ({ args, logger }) => {
    // Appeler la fonction pour obtenir les salles associées au cours
    let sessions = await getSalles(args.nomCours);
    if (sessions) {
      // Afficher les salles associées au cours
      sessions.forEach((session) => {
        logger.info(
          `La salle pour le cours ${args.nomCours} qui à lieu le ${session.day} à ${session.time} est : ${session.room}`
        );
      });
    } else {
      logger.error(`Le cours "${args.nomCours}" n'a pas été trouvé.`);
    }
  })

  // Obtenir la capacité d'une salles (Specification 2)
  .command("capacite", "Récupérer les capacités maximales d'une salle")
  .argument("<nomSalle>", "Nom de la salle")
  .action(async ({ args, logger }) => {
    // Appeler la fonction pour récupérer les capacités maximales de la salle
    let capacite = await getCapacite(args.nomSalle);

    if (capacite !== null) {
      logger.info(
        `Capacité maximale de la salle "${args.nomSalle}": ${capacite} personnes`
      );
    } else {
      logger.err(`La salle "${args.nomsalle}" n'a pas été trouvée.`);
    }
  })

  // Voir les données

  .command("data", "Retrieve all data into objects")
  .action(({ args, options, logger }) => {
    const parser = new CourseParser();
    parser
      .getParsedCourses()
      .then((parsedCourses) => {
        //logger.info("Parsed courses : ", parsedCourses);
        let firstCOurse = parsedCourses[0];
        let sessions = firstCOurse.sessions;
        logger.info("Sessions : ", sessions);
      })
      .catch((err) => console.error(err));
  });

cli.run(process.argv.slice(2));
