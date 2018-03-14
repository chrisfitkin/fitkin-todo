# Fitkin ToDo

Fitkin ToDo is a RESTful API for projects, tasks, and users. 

I hand coded most of the implementation for this project instead of using a lot of external libraries to demonstrate understanding of core concepts and development skills.  The `models` files are a good example of this approach where data access and validation methods are custom for this application.  In production I would likely use an ORM library for defining the models and enforcing validation.

Getting Started
---------------
```sh
git clone https://github.com/chrisfitkin/fitkin-todo
npm install
PORT=8080 npm run dev
```

Endpoints
---------
```
/api/projects
/api/tasks
/api/users
```

Important Files
---------------
`./src/index.js` is the entrypoint for the applicaiton.  Most of the application logic is in `./src/api` and `./src/models`.

NeDB Database
-------------
The application uses the NeDB library for data storage.  This solution was chosen so that the application could run without external database resource dependencies.  For production this should be swapped out

Security
--------------
*Authentication* is written as middleware using Basic HTTP authentication.  In production this would be replaced with a more complex Authentication scheme like JWT/OAuth.  Authentication logic can be found in `./middleware/authenticate.js`.

To authenticate, pass a base64 encoded `username:password` string with the following `Authentication` http header.

`aladdin@gmail.com:OpenSesame`

```
Authorization: Basic YWxhZGRpbkBnbWFpbC5jb206T3BlblNlc2FtZQ==
```
https://en.wikipedia.org/wiki/Basic_access_authentication

Per requirements, the only 2 endpoints that require authentication are Create Project and Create Task.  This is enforced at the endoint function.  In production I would likely implement an *Authorization* middleware and ACL or other role based permissions.  All other endpoints are public.

### Passwords

Passwords are stored in the database as base64 encoded strings.  This is to demonstrate a best practice for non-cleartext password storage.  In production I would implement a more secure password encryption method, or offload identity management to a secure 3rd party provider.

Microservices
-------------
All resources are located in this application for simplicity.  In production they could be broken up into individual microservices with a common API gateway.


Testing
-------
I began writing integration acceptence tests in './tests/projects.js' but did not have time to complete tests for all criterea.  In production I would also write unit tests and enforce test coverage for individual module files.  To run tests:

```sh
npm run test
```

Repository cloned from
-----------
This project source code was initially cloned from `express-es6-rest-api` to save setup time.  It has a good folder structure and implementation of `resource-router-middleware`.  This helps enforce RESTful standards and demonstrates OOP design.  In production I would build from an empty project.

https://github.com/developit/express-es6-rest-api

License
-------
MIT
