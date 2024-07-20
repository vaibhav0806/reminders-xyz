const figlet = require("figlet");
const { Command } = require("commander");
const { prompt: enqprompt, Select } = require("enquirer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const Table = require("cli-table3");
import { Task } from "../db/task";

console.log(figlet.textSync("Reminders"));

const tasksFilePath = path.join(__dirname, "..", "..", "db", "tasks.json");

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
    choices: ["second", "minute", "hourly", "daily", "weekly", "monthly"],
});

const addTask = async () => {
  const task_name = await enqprompt(question1);
  let rem_period: any = "";
  await select_prompt.run().then((answer: any) => (rem_period = answer));
  const time = await enqprompt(question2);
  console.log("Task added successfully", task_name, time, {
    rem_period: rem_period,
  });

  const newTask: Task = {
    id: uuidv4(),
    name: task_name.task,
    reminderType: rem_period,
    createdAt: new Date(),
    timeToRemind: time.time,
  };

  fs.readFile(tasksFilePath, "utf8", (err: any, data: any) => {
    let tasksJson;

    if (err) {
      // If the file doesn't exist or can't be read, initialize with an empty tasks array
      tasksJson = { tasks: [] };
    } else {
      try {
        tasksJson = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing tasks.json:", parseError);
        tasksJson = { tasks: [] };
      }
    }

    console.log(newTask);

    // Write the updated tasks back to tasks.json
    fs.writeFile(
      tasksFilePath,
      JSON.stringify(tasksJson, null, 2),
      (writeErr: any) => {
        if (writeErr) {
          console.error("Error writing to tasks.json:", writeErr);
        } else {
          console.log("Task successfully added to tasks.json");
        }
      }
    );
  });
};

const listTasks = async () => {
  await fs.readFile(tasksFilePath, "utf8", (err: any, data: any) => {
    let tasksJson;

    if (err) {
      // If the file doesn't exist or can't be read, initialize with an empty tasks array
      tasksJson = { tasks: [] };
    } else {
      try {
        tasksJson = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing tasks.json:", parseError);
        tasksJson = { tasks: [] };
      }
    }
    let table = new Table({
      head: ["Task ID", "Task", "Time to remind", "Recurring Pattern"],
      style: { head: ["blue"] },
    });

    tasksJson.tasks.forEach((task: Task, index: any) => {
      table.push([index, task.name, task.timeToRemind, task.reminderType]);
    });

    console.log("listing all tasks...");
    console.log(table.toString());
  });
};

const removeTask = async () => {
  const question = [
    {
      type: "input",
      name: "task_id",
      message: "Enter the task id you want to remove",
    },
  ];
  const task_id = await enqprompt(question);

  console.log(task_id.task_id);
  fs.readFile(tasksFilePath, "utf8", (err: any, data: any) => {
    let tasksJson;

    if (err) {
      // If the file doesn't exist or can't be read, initialize with an empty tasks array
      tasksJson = { tasks: [] };
    } else {
      try {
        tasksJson = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing tasks.json:", parseError);
        tasksJson = { tasks: [] };
      }
    }

    //remove id input check
    if (
      task_id.task_id === "" ||
      isNaN(task_id.task_id) ||
      task_id.task_id > tasksJson.tasks.length - 1
    ) {
      console.log("\x1b[31m%s\x1b[0m", "Please enter a valid task id");
      return;
    }

    tasksJson.tasks.splice(task_id.task_id, 1);

    fs.writeFile(
      tasksFilePath,
      JSON.stringify(tasksJson, null, 2),
      (writeErr: any) => {
        if (writeErr) {
          console.error("Error writing to tasks.json:", writeErr);
        } else {
          console.log("Task successfully removed from tasks.json");
        }
      }
    );
  });
};

if (options.add) {
    addTask();
    //give time options - hourly , daily , weekly , monthly
    console.log(`Restart Cron Job using 'npm run cron`);
}

if (options.list) {
  listTasks();

  //table display ( taskid , task , recurring pattern )
  //today
  //later
}

if (options.remove) {
  listTasks();
  setTimeout(() => {
    removeTask();
  }, 1000);
}
