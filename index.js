const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mewtwo',
    database: 'employee_tracker_db'
});

function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    })
};

function viewDepartments() {
    console.log("View Departments");
}

function viewRoles() {
    console.log("View Roles");
}

function addEmployee() {
    console.log("Add Employee");
}

function addDepartment() {
    console.log("Add Department");
}

function addRole() {
    console.log("Add Role");
}

function updateRole() {
    console.log("Update Role");
}

// RESULT: initializes the application
function init() {
    inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'options',
            choices: ['View all employees', 'View all departments', 'View all roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Exit']
        },
    )
    .then((answers) => {
        switch (answers.options) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    })
}

init();