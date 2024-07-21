const path = require('path');
const fs = require('fs');
const tasksFilePath = path.join(__dirname, "..", "..", "db", "tasks.json");
const { prompt: enqprompt, Select } = require("enquirer");

export const removeTask = async () => {
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