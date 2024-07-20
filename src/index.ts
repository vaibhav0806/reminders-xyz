const figlet = require("figlet");
const { Command } = require("commander");

console.log(figlet.textSync("Reminders"));

const program = new Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-a, --add  <value>", "add a task")
  .option("-l, --list", "list all tasks")
  .option("-r, --remove <value>", "remove a task")
  .parse(process.argv);

const options = program.opts();

if (options.add) {
    console.log('adding a new task...', options.add);
}

if (options.list) {
    console.log('listing all tasks...', options.list);
}

if (options.remove) {
    console.log('removing a task...', options.remove);
}