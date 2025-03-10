# Back-End Coding Test
A Node.js application that fetches GitHub user data, stores it in a PostgreSQL database, and allows for querying users by location or programming language. 
The application uses TypeScript for better development experience, pg-promise for database interactions, and Knex.js for database migrations.

## Features
Fetch GitHub user information using the GitHub API.

Store GitHub user data in a PostgreSQL database.

Fetch users by location and language stored in the database.

## Technologies Used
Node.js: Backend server.

TypeScript: Type-safe development with enhanced developer experience.

PostgreSQL: Database for storing user data.

pg-promise: Library for interacting with PostgreSQL.

Knex.js: SQL query builder and migration tool.

Axios: HTTP client for interacting with GitHub's API.

## Prerequisites
Node.js

PostgreSQL

## Instalation
1. Clone the repository

```
git clone <repository-url>
cd <project-folder>
```

2. Install Dependencies

```
npm install
```

3. Set up your PostgreSQL database

Create a PostgreSQL database and configure it directly in the db.ts file. Example connection string in db.ts:

```
const db = pgp('postgres://username:password@localhost:5432/database_name');
```

4. Run database migrations

The application uses Knex.js for database migrations. First, setup and configure the knexfile.js. If you haven’t already set up the database, run the migrations:

```
npx knex migrate:latest
```

## Usage

Using `node dist/app.js` you can run the application. On the app, you can interact with it according to the provided menu options in the terminal. The app fetches GitHub user data based on the username and stores it in a PostgreSQL database. You can query the database to view all users or filter users by location or programming language.

## Database Schema

The database contains a table users with the following columns:

* id: Primary key, auto-incrementing.
* username: GitHub username (unique).
* name: Name of the user (nullable).
* bio: Bio of the user (nullable).
* location: Location of the user (nullable).
* public_repos: Number of public repositories.
* languages: List of programming languages used by the user.
* followers: Number of followers.
* following: Number of users the GitHub user is following.
* html_url: URL to the user's GitHub profile.

## Tests

Database:

https://youtu.be/GIKRf5LJ3c0

App:

https://youtu.be/4WH5srdB29w
