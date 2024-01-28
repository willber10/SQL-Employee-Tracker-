const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mewtwo',
    database: 'employee_tracker_db'
});

function viewEmployees() {
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title AS role, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`;

    db.query(query, function (err, results) {
        if (err) {
            console.log(err);
            init();
        } else {
            console.table(results);
            init();

        }
    });
}

function viewDepartments() {
    db.query(`SELECT id, name 'department' FROM department`, function (err, results) {
        if (err) {
            console.log(err);
            init();
        } else {
            console.table(results);
            init();
        }
    });
}

function viewRoles() {
    db.query(`SELECT role.id, title 'role', salary, department.name 'department' 
    FROM role 
    JOIN department 
    ON role.department_id = department.id`, 
    function (err, results) {
        if (err) {
            console.log(err);
            init();
        } else {
            console.table(results);
            init();
        }
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employee\'s first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employee\'s last name?'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the employee\'s role ID?'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the employee\'s manager ID?'
        }
    ]).then((answers) => {
        db.query('INSERT INTO employee SET ?', answers, function (err, results) {
            if (err) {
                console.log(err);
                init();
            } else {
                console.log(results);
                console.log("employee added");
                init();
            }
        });
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the department\'s name?'
        }
    ]).then((answers) => {
        db.query('INSERT INTO department SET ?', answers, function (err, results) {
            if (err) {
                console.log(err);
                init();
            } else {
                console.log("department added");
                init();
            }
        });
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the role\'s title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the role\'s salary?'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the role\'s department ID?'
        }
    ]).then((answers) => {
        db.query('INSERT INTO role SET ?', answers, function (err, results) {
            if (err) {
                console.log(err);
                init();
            } else {
                console.log("role added");
                init();
            }
        });
    })
}

function updateRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'What is the employee\'s ID?'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the employee\'s new role ID?'
        }
    ]).then((answers) => {
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.id], function (err, results) {
            if (err) {
                console.log(err);
                init();
            } else {
                console.log("employee role updated");
                init();
            }
        });
    })
}

function init () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all departments', 'View all roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Exit']
        }
    ]).then((answers) => {
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
