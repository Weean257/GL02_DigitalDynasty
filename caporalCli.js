const { getData } = require("./Parser");

const cli = require("@caporal/core").default;

cli
  .version("sru-cli")
  .version("1.0")

  .command("hello", "Hello the world")
  .argument("<name>", "The name to display")
  .action(({ args, options, logger }) => {
    return logger.info(`Hello ${args.name}`);
  })

  .command("data", "Hello the world")
  .action(({ args, options, logger }) => {
    return logger.info(JSON.stringify(getData()));
  });

cli.run(process.argv.slice(2));
