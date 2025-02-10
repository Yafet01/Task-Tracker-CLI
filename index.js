const fs = require('fs');
const path = require('path');

//Path to task json file
const tasksFilePath = path.join(__dirname, 'tasks.json');

//Function to read tasks from the JSON file 
function readTasks(){
    //if the json file doesnt exist it should create the file and create it with empty string
    if(!fs.existsSync(tasksFilePath)){
        fs.writeFileSync(tasksFilePath,JSON.stringify([]));
        return[];
    }

    //if the json file exists read the content
    try {
        const data=fs.readFileSync(tasksFilePath, 'utf8');
        //if valid json data then return data or return empty array
            if(data===""|| data=== null || data=== undefined){
                fs.writeFileSync(tasksFilePath,JSON.stringify([]));
                return [];
            }
            return JSON.parse(data);
        
    } catch (error) {
        console.error('Error parsing JSON:', error);
        fs.writeFileSync(tasksFilePath, JSON.stringify([]));
        return [];
        
    }

}

//function to write tasks to the JSON
function writeTasks(tasks){
    fs.writeFileSync(tasksFilePath,JSON.stringify(tasks, null ,2), 'utf8');
}

//function to get the next avaliable task id
function getNextId(tasks){
    const ids = tasks.map((task)=>task.id);
    ids.sort((a,b)=> a-b);
    let nextId=1;
    for (const id of ids){
        if (id !== nextId) break;
        nextId +=1;
    }
    return nextId;
}

//function to add a task
function addTask(description){
    const tasks=readTasks();
    const newTask={
        id: getNextId(tasks),
        description: description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);
    console.log(`Task ID:${newTask.id}, Description: ${description} added successfully!`);
}

//function to update a task's description or status
function updateTask(id, newDescription,newStatus){
    const tasks= readTasks(); 
    const task= tasks.find((task)=> task.id === parseInt(id));
    
    if (task){
        if(newDescription) task.description = newDescription;
        if (newStatus) task.status= newStatus;
        task.updatedAt =new Date().toISOString();
        writeTasks(tasks);
        console.log(`Task with ID ${id} updated successfully!`);
    } else {
        console.log(`Task with ID ${id} not Found.`);
        
    }
}

//function to delete a task
function deleteTask (id){
    const tasks = readTasks();
    const newTasks= tasks.filter((task)=> task.id !== parseInt(id));
    if ( newTasks.length < tasks.length ){
        writeTasks(newTasks);
        console.log(`Task with ID ${id} deleted successfully!`);
    } else{
        console.log(`Task with ID ${id} not found.`);      
    }

}

// function to list all tasks
function listAllTasks(){
    const tasks = readTasks();
    if(tasks.length===0){
        console.log('No task found.');
    } else{
        console.log('All tasks:');
        tasks.forEach(task => {
            console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
        });
        
    }
    
}

// Function to list tasks by status
function listByStatus(status){
    const tasks= readTasks();
    const filteredTasks= tasks.filter((task)=> task.status.toLowerCase()===status.toLowerCase());

    if (filteredTasks.length === 0){
        console.log(`No tasks are ${status}.`);
    } else{
        console.log(`Tasks with "${status}":`);
        filteredTasks.forEach((task)=>{
            console.log(`ID: ${task.id}, Description: "${task.description}", Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
        });
    }
}

// CLI logic that processes user input commands
function handleCommand() {
    const [,, command, ...args] = process.argv;

    switch (command) {
        case 'add':
            const description = args.join(' ');
            if (description) {
                addTask(description);
            } else {
                console.log('Please provide a description for the task.');
            }
            break;

        case 'update':
            const [updateId, ...newDescription] = args;
            const newStatus = args[args.length - 1].toLowerCase() === "done" || args[args.length - 1].toLowerCase() === "in progress" ? args.pop() : null;
            if (updateId && (newDescription.length || newStatus)) {
                updateTask(updateId, newDescription.join(' '), newStatus);
            } else {
                console.log('Please provide both the task ID and a new description or status.');
            }
            break;

        case 'delete':
            const deleteId = args[0];
            if (deleteId) {
                deleteTask(deleteId);
            } else {
                console.log('Please provide the task ID to delete.');
            }
            break;

        // Marking tasks as in-progress
        case 'mark-in-progress':
            const inProgressId = args[0];
            if (inProgressId) {
                updateTask(inProgressId, null, 'in-progress');
                console.log(`Task with ID ${inProgressId} marked as in-progress.`);
            } else {
                console.log('Please provide the task ID to mark as in-progress.');
            }
            break;

        // Marking tasks as done
        case 'mark-done':
            const doneId = args[0];
            if (doneId) {
                updateTask(doneId, null, 'done');
                console.log(`Task with ID ${doneId} marked as done.`);
            } else {
                console.log('Please provide the task ID to mark as done.');
            }
            break;

        case 'list':
            listAllTasks();
            break;

        case 'list-status':
            const status = args[0];
            if (status) {
                listByStatus(status);
            } else {
                console.log('Please provide a status ("todo", "in-progress", "done").');
            }
            break;

        default:
            console.log('Invalid command. Supported commands: add, update, delete, mark-in-progress, mark-done, list, list-status.');
    }
}

// Invoke the handleCommand function to process user input
handleCommand();
