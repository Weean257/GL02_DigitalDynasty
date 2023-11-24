const cli = require("@caporal/core").default;

cli
  .version("sru-cli")
  .version("1.0")
  // check Vpf
  .command("hello", "Hello the world")
  .argument("<name>", "The name to display")
  .action(({ args, options, logger }) => {
    return logger.info(`Hello ${args.name}`);
  });

cli.run(process.argv.slice(2));
