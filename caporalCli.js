const CourseParser = require("./Parser");
const generateICalendar = require("./calendar");
const fs = require('fs');
const checkForOverlaps = require("./overlap");
const { execSync } = require('child_process');
const { getCapacite, getSalles } = require("./CoursFunction");
const getRoom = require("./RoomFunction");
const getHour = require("./RoomFunction");

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

  
  //SPEC_4 Fonction pour obtenir le salles associées à un créneau donné
  .command ('FreeRoom', 'Salles libres')
  .argument ('<hour>', 'Créneau')
  .argument ('<Day>', 'Jours')
  .action(({args, options, logger}) =>{
    //Appel de la fonction pour la récupération des salles libres
    getRoom.getRoom (args.hour, args.day, logger);
  })

 //SPEC_3 Fonction pour afficher pour une salle donnée les créneaux auxquels elle sera libre.
  .command('FreeHour','Créneaux libres')
  .argument ('<room>', 'Salle')
  .action(({args, options, logger}) =>{
    //Appel de la fonction pour la récup"ration des créneaux libres
    getHour.getHour (args.room, logger);
    
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
  })


  .command('room-occupancy', 'Afficher les créneaux d\'occupation d\'une salle')
  .argument('<roomCode>', 'Code de la salle')
  .action(async ({ args, logger }) => {
    try {
        const parser = new CourseParser();
        const parsedCourses = await parser.getParsedCourses();

        let occupancy = [];
        parsedCourses.forEach(course => {
            course.sessions.forEach(session => {
                if (session.room === args.roomCode) {
                    occupancy.push({
                        day: session.day,
                        time: session.time,
                        courseCode: course.code
                    });
                }
            });
        });

        if (occupancy.length === 0) {
            logger.info(`Aucune occupation trouvée pour la salle ${args.roomCode}.`);
        } else {
            occupancy.forEach(session => {
                logger.info(`Jour: ${session.day}, Heure: ${session.time}, Cours: ${session.courseCode}`);
            });
        }
    } catch (error) {
        logger.error('Erreur lors de la recherche des créneaux d\'occupation :', error);
    }
  })

// fonction d'occupation des salles
async function calculateOccupancyRates() {
  const parser = new CourseParser();
  const parsedCourses = await parser.getParsedCourses(); // Récupère les cours parsés
  let roomOccupancyData = {};

  parsedCourses.forEach(course => {
    course.sessions.forEach(session => {
      const roomCode = session.room;
      const sessionDuration = calculateSessionDuration(session); // Calculez la durée du créneau

      // Si la salle est déjà dans l'objet, on ajoute la durée, sinon on initialise
      if (roomOccupancyData[roomCode]) {
        roomOccupancyData[roomCode].occupiedHours += sessionDuration;
      } else {
        roomOccupancyData[roomCode] = {
          occupiedHours: sessionDuration,
          capacity: getCapacite(roomCode) // Ou session.capacity si disponible
        };
      }
    });
  });

  // Transformer en tableau pour Vega-Lite
  return Object.keys(roomOccupancyData).map(roomCode => ({
    roomCode: roomCode,
    occupiedHours: roomOccupancyData[roomCode].occupiedHours,
    capacity: roomOccupancyData[roomCode].capacity
  }));
}

// Cette fonction calcule la durée d'une session donnée
function calculateSessionDuration(session) {
  const [startTime, endTime] = session.time.split('-').map(time => time.trim());
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  return (endHours + endMinutes / 60) - (startHours + startMinutes / 60);
}

// Commande Caporal pour calculer et générer le graphique des taux d'occupation des salles
cli.command('generate-occupancy-chart', 'Generate a chart showing the occupancy rates of rooms')
  .action(async ({ logger }) => {
    try {
      const occupancyData = await calculateOccupancyRates();
      const vegaLiteSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        description: 'Occupancy rates of rooms',
        data: { values: occupancyData },
        mark: 'bar',
        encoding: {
          x: { field: 'roomCode', type: 'nominal', axis: { labelAngle: -45 } },
          y: { field: 'occupiedHours', type: 'quantitative' },
          tooltip: [
            { field: 'roomCode', type: 'nominal' },
            { field: 'occupiedHours', type: 'quantitative' },
            { field: 'capacity', type: 'quantitative' }
          ]
        }
      };

      fs.writeFileSync('occupancyVegaSpec.json', JSON.stringify(vegaLiteSpec));

      execSync('vl2png occupancyVegaSpec.json occupancyChart.png');
      logger.info('Occupancy chart generated successfully: occupancyChart.png');
    } catch (error) {
      logger.error('Error generating occupancy chart:', error);
    }
  });
 

cli.run(process.argv.slice(2));
