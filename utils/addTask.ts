const { v4: uuidv4 } = require("uuid");
const path = require("path");
const emailFile = require('../../config/user-config.json');
const { prompt: enqprompt, Select } = require("enquirer");
import { Task } from "../db/task";
const axios = require('axios');
const fs = require('fs');

const question1 = [
    {
        type: "input",
        name: "task",
        message: "Task name",
    },
];

const select_prompt = new Select({
    name: "color",
    message: "Pick an interval",
    choices: ["Minutely", "Daily", "Weekly", "Monthly"],
});

export const addTask = async () => {
    const task_name = await enqprompt(question1);
    let rem_period: any = "";
    await select_prompt.run().then((answer: any) => (rem_period = answer));
    console.log("Task added successfully", task_name, {
        rem_period: rem_period,
    });

    const newTask: Task = {
        id: uuidv4(),
        name: task_name.task,
        reminderType: rem_period,
        createdAt: new Date(),
        email: emailFile.email
    }

    console.log(newTask);

    try {
        const response = await axios.post(`http://128.199.16.234:3000/add`, newTask, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Task added successfully:', response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error adding task:', error);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};