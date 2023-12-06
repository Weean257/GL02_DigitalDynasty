
const CourseParser = require("./Parser");
const {getCapacite, getSalles} = require('./CoursFunction');

const cli = require("@caporal/core").default;

cli
  .version("sru-cli")
  .version("1.0")

  // Obtenir les salles grace au code du cours (Specification 1)
  .command('salles', 'Obtenir les salles associées a un cours donné')
  .argument('<nomCours>', 'Nom du cours ')

  .action(({ args, logger }) => {
    // Appeler la fonction pour obtenir les salles associées au cours
    getSalles(args.nomCours, logger);
  })

  // Obtenir la capacité d'une salles (Specification 2)
  .command('capacite', 'Récupérer les capacités maximales d\'une salle')
  .argument('<nomSalle>', 'Nom de la salle')
  .action(({ args, logger }) => { // Appeler la fonction pour récupérer les capacités maximales de la salle
    getCapacite(args.nomSalle, logger);
  })

  // Voir les données 

  .command("data", "Retrieve all data into objects")
  .action(({ args, options, logger }) => {
    const parser = new CourseParser();
    parser
      .getParsedCourses()
      .then((parsedCourses) => {
        //logger.info("Parsed courses : ", parsedCourses);
        let firstCOurse = parsedCourses[0]
        let sessions = firstCOurse.sessions
        logger.info("Sessions : ", sessions);
      })
      .catch((err) => console.error(err));
  });

cli.run(process.argv.slice(2));

