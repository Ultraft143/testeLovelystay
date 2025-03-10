"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const axios_1 = __importDefault(require("axios"));
const readline = __importStar(require("readline"));
const database_1 = require("./database");
// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Function to fetch GitHub user data
const fetchGitHubUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.github.com/users/${username}`);
        const user = response.data;
        // Log user data
        console.log('\nGitHub User Info:');
        console.log(`Username: ${user.login}`);
        console.log(`Name: ${user.name || 'N/A'}`);
        console.log(`Bio: ${user.bio || 'N/A'}`);
        console.log(`Location: ${user.location || 'N/A'}`);
        console.log(`Public Repos: ${user.public_repos}`);
        console.log(`Followers: ${user.followers}`);
        console.log(`Following: ${user.following}`);
        console.log(`Profile URL: ${user.html_url}`);
        // Insert user data into the database
        yield (0, database_1.insertGitHubUser)(user);
    }
    catch (error) {
        console.error('Error fetching user data. Please check the username and try again.');
    }
});
// Main menu function
const showMenu = () => {
    console.log('\nMenu:');
    console.log('1 - Search Username');
    console.log('2 - Fetch All Searched Users');
    console.log('3 - Exit');
    rl.question('Choose an option: ', (option) => __awaiter(void 0, void 0, void 0, function* () {
        switch (option) {
            case '1':
                rl.question('Enter a GitHub username: ', (username) => __awaiter(void 0, void 0, void 0, function* () {
                    yield fetchGitHubUser(username);
                    showMenu();
                }));
                break;
            case '2':
                yield (0, database_1.fetchAllUsers)();
                showMenu();
                break;
            case '3':
                console.log('Goodbye!');
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                showMenu();
                break;
        }
    }));
};
// Start the menu loop
showMenu();
