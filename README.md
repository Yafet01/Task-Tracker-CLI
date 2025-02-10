# Task-Tracker-CLI

Sample solution for the [Task Tracker challenge](https://roadmap.sh/projects/task-tracker) from roadmap.sh.

## Features
- Add a new task
- Update a task's description or status
- Delete a task
- List all tasks
- List tasks by their status(`todo`,`in-process`,`done`)
- Mark tasks as `in-progress` or `done` 

## Requirements
- node.js installed on your system

## Installation
To get started, clone the repository:

```bash
git clone https://github.com/Yafet01/Task-Tracker-CLI
cd Task-Tracker-CLI
```

## Usage
Run the application using:
```bash 
node index.js <command> [arguments]
```
## Commands
- add " "
- update <ID> "[arguments]" "[status]"
- delete <ID> 
- list
- list-status <status>
- mark-in-progress <ID>
- mark-done <ID>

## Examples
```bash
node index.js add "sumbit this challenge"

node index.js update 1 "This challenge is submitted" "done"

node index.js list

node index.js list-status "done"

node index.js delete 1
```

