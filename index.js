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
    db.query('SELECT * FROM role', function (err, roles) {
        if (err) {
            console.log(err);
            init();
            return;
        }

        db.query('SELECT * FROM employee', function (err, managers) {
            if (err) {
                console.log(err);
                init();
                return;
            }

            const roleChoices = roles.map(role => role.title);
            const managerChoices = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
                
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
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the employee\'s role?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who is the employee\'s manager?',
                    choices: managerChoices
                }
            ]).then((answers) => {
                const role = roles.find(role => role.title === answers.role_id);
                answers.role_id = role.id;

                const manager = managers.find(manager => `${manager.first_name} ${manager.last_name}` === answers.manager_id);
                answers.manager_id = manager.id;

                db.query('INSERT INTO employee SET ?', answers, function (err, results) {
                    if (err) {
                        console.log(err);
                        init();
                    } else {
                        console.log("Employee added!");
                        init();
                    }
                });
            });
        });
    });
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
    db.query('SELECT * FROM department', function (err, departments) {
        if (err) {
            console.log(err);
            init();
            return;
        }

        const departmentChoices = departments.map(department => department.name);

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
                type: 'list',
                name: 'department_id',
                message: 'What department does the role belong to?',
                choices: departmentChoices
            }
        ]).then((answers) => {
            const department = departments.find(department => department.name === answers.department_id);
            answers.department_id = department.id;

            db.query('INSERT INTO role SET ?', answers, function (err, results) {
                if (err) {
                    console.log(err);
                    init();
                } else {
                    console.log("Role added!");
                    init();
                }
            });
        });
    });
}


function updateRole() {
    db.query('SELECT * FROM employee', function (err, employees) {
        if (err) {
            console.log(err);
            init();
            return;
        }

        db.query('SELECT * FROM role', function (err, roles) {
            if (err) {
                console.log(err);
                init();
                return;
            }

            const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
            const roleChoices = roles.map(role => role.title);

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Which employee\'s role do you want to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the employee\'s new role?',
                    choices: roleChoices
                }
            ]).then((answers) => {
                const employee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.id);
                answers.id = employee.id;

                const role = roles.find(role => role.title === answers.role_id);
                answers.role_id = role.id;

                db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.id], function (err, results) {
                    if (err) {
                        console.log(err);
                        init();
                    } else {
                        console.log("Employee role updated!");
                        init();
                    }
                });
            });
        });
    });
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
