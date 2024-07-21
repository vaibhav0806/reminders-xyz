import { Task } from "../db/task";
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const emailFile = require('../../config/user-config.json');
const Table = require("cli-table3");

export const listTasks = async () => {
    try {
        // Prompt the user for their email
        const email = emailFile.email;
        // Make a GET request to the server
        const result = await axios.get(`http://localhost:3000/list`, {
            params: { email: email }
        });

        const tasks: Task[] = result.data.tasks;

        if (tasks.length === 0) {
            console.log('No tasks found for this email.');
            return;
        }

        // Create and populate the table
        let table = new Table({
            head: ["Index", "Id", "Task", "Type"],
            style: { head: ["blue"] },
        });

        tasks.forEach((task: Task, index: number) => {
            table.push([index, task.id.substring(0,5), task.name, task.reminderType]);
        });

        console.log("Listing all tasks...");
        console.log(table.toString());

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching tasks:', error);
        } else {
            console.error('An unexpected error occurred:', error);
        }
    }
};