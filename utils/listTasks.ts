import { Task } from "../db/task";
const path = require('path');
const fs = require('fs');
const tasksFilePath = path.join(__dirname, "..", "..", "db", "tasks.json");
const Table = require("cli-table3");

export const listTasks = async () => {
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