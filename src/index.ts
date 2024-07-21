#!/usr/bin/env node

const figlet = require("figlet");
const { Command } = require("commander");
import { addTask } from "../utils/addTask";
import { listTasks } from "../utils/listTasks";
import { removeTask } from "../utils/removeTask";
import { initConfig } from "../utils/initConfig";
const emailFile = require('../../config/user-config.json');

console.log(figlet.textSync("reminders-xyz"));

const program = new Command();

program
  .version("1.0.1")
  .description("An example CLI for managing a directory")
  .option("-a, --add ", "add a task")
  .option("-l, --list", "list all tasks")
  .option("-r, --remove", "remove a task")
  .option("-i, --init", "initialize user configuration")
  .parse(process.argv);

const options = program.opts();

if (options.init) {
  initConfig();
}

if (options.add) {
  if (!emailFile.email) {
    console.error(`ERR: Run 'reminders-xyz -i' to initialize first`);
    process.exit(1);
  }
  addTask();
}

if (options.list) {
  if (!emailFile.email) {
    console.error(`ERR: Run 'reminders-xyz -i' to initialize first`);
    process.exit(1);
  }
  listTasks();
}

if (options.remove) {
  if (!emailFile.email) {
    console.error(`ERR: Run 'reminders-xyz -i' to initialize first`);
    process.exit(1);
  }
  removeTask();
}
