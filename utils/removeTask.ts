const path = require("path");
import { Task } from "../db/task";
const fs = require("fs");
const emailFile = require("../../config/user-config.json");
const Table = require("cli-table3");
const { prompt: enqprompt, Select } = require("enquirer");
const axios = require("axios");

let tasks: Task[] = [];

const listRequest = async () => {
  try {
    // Prompt the user for their email
    const email = emailFile.email;
    // Make a GET request to the server
    const result = await axios.get(`http://localhost:3000/list`, {
      params: { email: email },
    });

    tasks = result.data.tasks;

    if (tasks.length === 0) {
      console.log("No tasks found for this email.");
      return;
    }

    // Create and populate the table
    let table = new Table({
      head: ["Index", "Id", "Task", "Type"],
      style: { head: ["blue"] },
    });

    tasks.forEach((task: Task, index: number) => {
      table.push([
        index,
        task.id.substring(0, 5),
        task.name,
        task.reminderType,
      ]);
    });

    console.log("Listing all tasks...");
    console.log(table.toString());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching tasks:", error);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};

const removeRequest = async () => {
  const question = [
    {
      type: "input",
      name: "task_index",
      message: "Enter the task id you want to remove",
    },
  ];
  const task_index = await enqprompt(question);

  console.log(task_index.task_index);

  try {
    const response = await axios.post(
      `http://localhost:3000/remove`,
      { task_id: tasks[task_index.task_index].id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Task deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error removing task:", error);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const removeTask = async () => {
  await listRequest();

  setTimeout(() => {
    removeRequest();
  }, 1000);

  // fs.readFile(tasksFilePath, "utf8", (err: any, data: any) => {
  //   let tasksJson;

  //   if (err) {
  //     // If the file doesn't exist or can't be read, initialize with an empty tasks array
  //     tasksJson = { tasks: [] };
  //   } else {
  //     try {
  //       tasksJson = JSON.parse(data);
  //     } catch (parseError) {
  //       console.error("Error parsing tasks.json:", parseError);
  //       tasksJson = { tasks: [] };
  //     }
  //   }

  //   //remove id input check
  //   if (
  //     task_id.task_id === "" ||
  //     isNaN(task_id.task_id) ||
  //     task_id.task_id > tasksJson.tasks.length - 1
  //   ) {
  //     console.log("\x1b[31m%s\x1b[0m", "Please enter a valid task id");
  //     return;
  //   }

  //   tasksJson.tasks.splice(task_id.task_id, 1);

  //   fs.writeFile(
  //     tasksFilePath,
  //     JSON.stringify(tasksJson, null, 2),
  //     (writeErr: any) => {
  //       if (writeErr) {
  //         console.error("Error writing to tasks.json:", writeErr);
  //       } else {
  //         console.log("Task successfully removed from tasks.json");
  //       }
  //     }
  //   );
  // });
};
