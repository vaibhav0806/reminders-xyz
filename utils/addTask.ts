const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { prompt: enqprompt, Select } = require("enquirer");
import { Task } from "../db/task";
const fs = require('fs');

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

export const addTask = async () => {
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
        timeToRemind: time.time
    }

    console.log(newTask);

    console.log(__dirname);
    const tasksFilePath = path.join(__dirname, '..', '..', 'db', 'tasks.json');

    fs.readFile(tasksFilePath, 'utf8', (err: any, data: any) => {
        let tasksJson;

        if (err) {
            // If the file doesn't exist or can't be read, initialize with an empty tasks array
            tasksJson = { tasks: [] };
        } else {
            try {
                tasksJson = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing tasks.json:', parseError);
                tasksJson = { tasks: [] };
            }
        }

        // Append the new task to the tasks array
        tasksJson.tasks.push(newTask);

        // Write the updated tasks back to tasks.json
        fs.writeFile(tasksFilePath, JSON.stringify(tasksJson, null, 2), (writeErr: any) => {
            if (writeErr) {
                console.error('Error writing to tasks.json:', writeErr);
            } else {
                console.log('Task successfully added to tasks.json');
            }
        });
    });

};