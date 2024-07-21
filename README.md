# reminders-xyz
![npm version](https://img.shields.io/npm/v/reminders-xyz)
![license](https://img.shields.io/npm/l/reminders-xyz)
![downloads](https://img.shields.io/npm/dt/reminders-xyz)

A command-line interface (CLI) tool for managing reminders and tasks.

## Installation

```bash
npm install -g reminders-xyz
```

## Usage

After installation, you can use the \`reminders-xyz\` command in your terminal.

```bash
reminders-xyz [options]
```

## Options

- `-v, --version`: Output the version number
- `-a, --add`: Add a new task
- `-l, --list`: List all tasks
- `-r, --remove`: Remove a task
- `-i, --init`: Initialize user configuration
- `-h, --help`: Display help for command

## Getting Started

1. Initialize the user configuration:
   ```bash
   reminders-xyz -i
   ```

2. Add a new task:
   ```bash
   reminders-xyz -a
   ```

3. List all tasks:
   ```bash
   reminders-xyz -l
   ```

4. Remove a task:
   ```bash
   reminders-xyz -r
   ```

## Note

Make sure to run the initialization command (`reminders-xyz -i`) before using other commands. If you try to use other commands without initializing, you'll receive an error message.

## Version

Current version: 1.0.1
