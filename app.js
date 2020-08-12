const fs = require('fs')
const yargs = require('yargs')
const chalk = require('chalk')

function loadData() {
    const buffer = fs.readFileSync('data.json')
    const dataString = buffer.toString();
    const javaSciptObject = JSON.parse(dataString)
    return javaSciptObject
}

function saveData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data))
}

function displayData(data) {
    data.forEach((item, index) => {
        if (index % 3 === 0) {
            console.log(chalk.blue(`id: ${item.id}`))
            console.log(chalk.blue(`todo: ${item.todo}`))
            console.log(chalk.blue(`completed: ${item.completed}`))
            console.log(chalk.blue(`name: ${item.name}`))
        } else if (index % 3 === 1) {
            console.log(chalk.yellow(`id: ${item.id}`))
            console.log(chalk.yellow(`todo: ${item.todo}`))
            console.log(chalk.yellow(`completed: ${item.completed}`))
            console.log(chalk.yellow(`name: ${item.name}`))
        } else {
            console.log(chalk.green(`id: ${item.id}`))
            console.log(chalk.green(`todo: ${item.todo}`))
            console.log(chalk.green(`completed: ${item.completed}`))
            console.log(chalk.green(`name: ${item.name}`))
        }
    })
}

// *---- ADD -----*
yargs.command({
    command: "add",
    describe: "Add a new task",
    builder: {
        todo: {
            describe: "Todo content",
            demandOption: true,
            type: "string"
        },
        name: {
            describe: "Who will do the task",
            demandOption: false,
            type: "string",
            default: "admin"
        },
        completed: {
            describe: "Task status",
            demandOption: false,
            default: false,
            type: "boolean"
        }
    },
    handler: function ({ todo, name, completed }) {
        try {
            const todoList = loadData()
            const id = todoList.length ? todoList[todoList.length - 1].id + 1 : 1;
            const task = {
                id: id,
                todo,
                name,
                completed
            }
            todoList.push(task)
            saveData(todoList)
            console.log("Adding task successfully");
            displayData(todoList)
        } catch (err) {
            console.log(chalk.red("Adding task fail, error:", err));
        }

    }
});

// *---- LIST -----*
yargs.command({
    command: "list",
    describe: "List tasks, options: '--completed' || '--name='admin'|| '--id='1'' || --task='name of task' ",
    builder: {
        status: {
            describe: "show tasks base on completed option \n  could be either 'all' || 'completed' || 'uncompleted'",
            demandOption: false,
            type: "string",
            default: "all"
        },
        name: {
            describe: "show all tasks done by name",
            demandOption: false,
            type: "string",
            default: ""
        },
        id: {
            describe: "show the task by id",
            demandOption: false,
            default: 0,
            type: "number"
        },
        task: {
            describe: "show the task by name",
            demandOption: false,
            default: '',
            type: "string"
        },

    },
    handler: function ({ status, name, id, task }) {
        const todoList = loadData()

        // filter by status
        let results = todoList
        let resultsTemp = []
        if (status === "completed") {
            resultsTemp = results.filter(item => item.completed === true)
        } else if (status === "uncompleted") {
            resultsTemp = results.filter(item => item.completed === false)
        } else {
            resultsTemp = results
        }
        results = resultsTemp

        //filter by name
        resultsTemp = []
        if (name !== '') {
            resultsTemp = results.filter(item => item.name === name)
            results = resultsTemp
        }

        //filter by id 
        resultsTemp = []
        if (parseInt(id) > 0) {
            resultsTemp = results.filter(item => item.id === parseInt(id))
            results = resultsTemp
        }

        //filter by task
        resultsTemp = []
        if (task !== '') {
            resultsTemp = results.filter(item => item.todo === task)
            results = resultsTemp
        }
        displayData(results)
    }
});

// *---- DELETE -----*
yargs.command({
    command: "delete",
    describe: "Delete tasks, options: '--completed' || '--name='admin'|| '--id='1'' || --task='name of task' ",
    builder: {
        status: {
            describe: "Delete tasks base on completed option \n  could be either 'completed' || 'uncompleted'",
            demandOption: false,
            type: "string",
            default: ""
        },
        name: {
            describe: "Delete tasks by name of person",
            demandOption: false,
            type: "string",
            default: ""
        },
        id: {
            describe: "Delete the task by id",
            demandOption: false,
            default: 0,
            type: "number"
        },
        task: {
            describe: "Delete the task by name",
            demandOption: false,
            default: '',
            type: "string"
        },

    },
    handler: function ({ id, status, name, task }) {
        try {
            const todoList = loadData()

            // filter by status
            let results = todoList
            let resultsTemp = []
            if (status === "completed") {
                resultsTemp = results.filter(item => item.completed !== true)
            } else if (status === "uncompleted") {
                resultsTemp = results.filter(item => item.completed !== false)
            } else {
                resultsTemp = results
            }
            results = resultsTemp

            //filter by name
            resultsTemp = []
            if (name !== '') {
                resultsTemp = results.filter(item => item.name !== name)
                results = resultsTemp
            }

            //filter by id 
            resultsTemp = []
            if (parseInt(id) > 0) {
                resultsTemp = results.filter(item => item.id !== parseInt(id))
                results = resultsTemp
            }

            //filter by task
            resultsTemp = []
            if (task !== '') {
                resultsTemp = results.filter(item => item.todo !== task)
                results = resultsTemp
            }

            if (results.length === todoList.length) {
                throw (`No have task with your input`)
            }

            saveData(results)
            console.log('Delete successfully')
            displayData(results)
        } catch (err) {
            console.log(chalk.red('Delete err:', err))
        }

    }
});

// *---- TOGGLE -----*
yargs.command({
    command: "toggle",
    describe: "Change tasks, options: '--completed' || '--name='admin' || --task='name of task' ",
    builder: {
        status: {
            describe: "Change tasks base on completed option \n 'completed' || 'uncompleted'",
            demandOption: false,
            type: "string",
            default: ""
        },
        name: {
            describe: "Change the name of person do the task",
            demandOption: false,
            type: "string",
            default: ""
        },
        id: {
            describe: "Change the task with id",
            demandOption: true,
            type: "number"
        },
        task: {
            describe: "Change the name task",
            demandOption: false,
            default: '',
            type: "string"
        },

    },
    handler: function ({ id, status, name, task }) {
        try {
            const todoList = loadData()
            let index = todoList.findIndex(item => item.id === parseInt(id))
            if (index >= 0) {

                //check status
                switch (status) {
                    case "completed":
                        if (todoList[index].completed === "uncompleted") {
                            todoList[index].completed === "completed"
                        }
                    case "uncompleted":
                        if (todoList[index].completed === "completed") {
                            todoList[index].completed === "uncompleted"
                        }
                    case "":
                    case undefined:
                        break;
                    default:
                        throw "Status must be completed or uncompleted"

                }

                if (name !== '') {
                    todoList[index].name = name
                }

                if (task !== '') {
                    todoList[index].task = task
                }
                // console.log('todoList:', todoList)
                console.log('Change successfully')
                displayData(todoList)
            } else {
                throw `Not have the task with id = ${id} `
            }

        } catch (err) {
            console.log(chalk.red('Toggle err:', err))
        }

    }
});
yargs.parse()
