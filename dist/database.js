"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsersByLanguage = exports.fetchUsersByLocation = exports.fetchAllUsers = exports.insertGitHubUser = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
//database connection
const pgp = (0, pg_promise_1.default)();
const db = pgp('postgres://postgres:123@localhost:5432/lovelystay');
exports.default = db;
// Insert user to db
const insertGitHubUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkUser = yield db.any('SELECT * FROM users WHERE username = $1', user.login);
        if (checkUser.length !== 0) {
            yield db.none(`UPDATE users SET 
          name = $2, 
          bio = $3, 
          location = $4, 
          public_repos = $5, 
          languages = $6, 
          followers = $7, 
          following = $8, 
          html_url = $9 
        WHERE username = $1`, [
                user.login,
                user.name,
                user.bio,
                user.location,
                user.public_repos,
                user.languages,
                user.followers,
                user.following,
                user.html_url,
            ]);
            console.log('User data updated successfully.');
        }
        else {
            yield db.none(`INSERT INTO users(
          username, name, bio, location, public_repos, languages, followers, 
          following, html_url) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
                user.login,
                user.name,
                user.bio,
                user.location,
                user.public_repos,
                user.languages,
                user.followers,
                user.following,
                user.html_url,
            ]);
            console.log('User data inserted into database successfully.');
        }
    }
    catch (error) {
        console.error('Error inserting data into the database:', error);
    }
});
exports.insertGitHubUser = insertGitHubUser;
// show users on db
const fetchAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db.any('SELECT * FROM users');
        if (users.length === 0) {
            console.log('No users found in the database.');
        }
        else {
            console.log('\nAll Searched GitHub Users:');
            users.forEach((user) => {
                console.log(`ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, 
           Bio: ${user.bio}, Location: ${user.location}, Public Repos: 
           ${user.public_repos}, Languages: ${user.languages}, Followers: 
           ${user.followers}, Following: ${user.following}, Profile URL: 
           ${user.html_url}\n`);
            });
        }
    }
    catch (error) {
        console.error('Error fetching users from the database:', error);
    }
});
exports.fetchAllUsers = fetchAllUsers;
// show users by given location
const fetchUsersByLocation = (location) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db.any('SELECT * FROM users WHERE location = $1', location);
        if (users.length === 0) {
            console.log('No users found in the database with that location.');
        }
        else {
            console.log('\nAll Searched GitHub Users with the given Location:');
            users.forEach((user) => {
                console.log(`ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, 
           Bio: ${user.bio}, Location: ${user.location}, Public Repos: 
           ${user.public_repos}, Languages: ${user.languages}, Followers: 
           ${user.followers}, Following: ${user.following}, Profile URL: 
           ${user.html_url}\n`);
            });
        }
    }
    catch (error) {
        console.error('Error fetching users from the database:', error);
    }
});
exports.fetchUsersByLocation = fetchUsersByLocation;
// show users by given language
const fetchUsersByLanguage = (language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db.any('SELECT * FROM users WHERE $1 = ANY(languages)', language);
        if (users.length === 0) {
            console.log('No users found in the database with that language.');
        }
        else {
            console.log('\nAll Searched GitHub Users with the given Languages:');
            users.forEach((user) => {
                console.log(`ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, 
           Bio: ${user.bio}, Location: ${user.location}, Public Repos: 
           ${user.public_repos}, Languages: ${user.languages}, Followers: 
           ${user.followers}, Following: ${user.following}, Profile URL: 
           ${user.html_url}\n`);
            });
        }
    }
    catch (error) {
        console.error('Error fetching users from the database:', error);
    }
});
exports.fetchUsersByLanguage = fetchUsersByLanguage;
