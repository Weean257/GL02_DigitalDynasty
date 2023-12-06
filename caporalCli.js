const CourseParser = require("./Parser");

const cli = require("@caporal/core").default;

cli
  .version("sru-cli")
  .version("1.0")

  .command("hello", "Hello the world")
  .argument("<name>", "The name to display")
  .action(({ args, options, logger }) => {
    return logger.info(`Hello ${args.name}`);
  })

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
  })





cli.run(process.argv.slice(2));
