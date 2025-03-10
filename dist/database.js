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
exports.fetchAllUsers = exports.insertGitHubUser = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)();
const db = pgp('postgres://postgres:123@localhost:5432/lovelystay');
exports.default = db;
// Function to insert GitHub user data into the database
const insertGitHubUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkUser = yield db.any('SELECT * FROM users WHERE username = $1', user.login);
        if (checkUser.length != 0) {
            console.log('User already exists on the database.');
        }
        else {
            yield db.none('INSERT INTO users(username, name, bio, location, public_repos, followers, following, html_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [user.login, user.name, user.bio, user.location, user.public_repos, user.followers, user.following, user.html_url]);
            console.log('User data inserted into database successfully.');
        }
    }
    catch (error) {
        console.error('Error inserting data into the database:', error);
    }
});
exports.insertGitHubUser = insertGitHubUser;
// Function to fetch all users from the database
const fetchAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db.any('SELECT * FROM users');
        if (users.length === 0) {
            console.log('No users found in the database.');
        }
        else {
            console.log('\nAll Searched GitHub Users:');
            users.forEach((user) => {
                console.log(`ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, Bio: ${user.bio}, Location: ${user.location}, Public Repos: ${user.public_repos}, Followers: ${user.followers}, Following: ${user.following}, Profile URL: ${user.html_url}\n`);
            });
        }
    }
    catch (error) {
        console.error('Error fetching users from the database:', error);
    }
});
exports.fetchAllUsers = fetchAllUsers;
