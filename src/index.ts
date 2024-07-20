const figlet = require("figlet");
const { Command } = require("commander");
const { prompt: enqprompt, Select } = require("enquirer");

console.log(figlet.textSync("Reminders"));

const program = new Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-a, --add ", "add a task")
  .option("-l, --list", "list all tasks")
  .option("-r, --remove", "remove a task")
  .parse(process.argv);

const options = program.opts();

const question1 = [
  {
    type: "input",
    name: "task",
    message: "Enter a task",
  },
];
const question2 = [
  {
    type: "input",
    name: "time",
    message:
      "enter the time of the day you want to be reminded at in hh:mm (24hr format)",
  },
];

const select_prompt = new Select({
  name: "color",
  message: "Pick an interval",
  choices: ["hourly", "daily", "weekly", "monthly"],
});

const addTask = async () => {
  const task_name = await enqprompt(question1);
  let rem_period = "";
  await select_prompt.run().then((answer: any) => (rem_period = answer));
  const time = await enqprompt(question2);
  console.log("Task added successfully", task_name, time, {
    rem_period: rem_period,
  });
};

if (options.add) {
  addTask();
  //give time options - hourly , daily , weekly , monthly
}

if (options.list) {
  console.log("listing all tasks...", options.list);
  //table display ( taskid , task , recurring pattern )
  //today
  //later
}

if (options.remove) {
  console.log("removing a task...", options.remove);
}
