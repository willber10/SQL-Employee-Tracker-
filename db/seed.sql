USE employee_tracker_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000.00, 1),
       ('Salesperson', 80000.00, 1),
       ('Lead Engineer', 150000.00, 2),
       ('Software Engineer', 120000.00, 2),
       ('Accountant', 125000.00, 3),
       ('Legal Team Lead', 250000.00, 4),
       ('Lawyer', 190000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Mike', 'Chan', 2, NULL),
       ('Ashley', 'Rodriguez', 3, NULL),
       ('Kevin', 'Tupik', 4, NULL),
       ('Malia', 'Brown', 5, NULL),
       ('Sarah', 'Lourd', 6, NULL),
       ('Tom', 'Allen', 7, NULL);

UPDATE employee SET manager_id = 1 WHERE first_name = 'Mike' AND last_name = 'Chan';
UPDATE employee SET manager_id = 3 WHERE first_name = 'Kevin' AND last_name = 'Tupik';
UPDATE employee SET manager_id = 6 WHERE first_name = 'Tom' AND last_name = 'Allen';

