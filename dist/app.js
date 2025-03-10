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
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// get user on git API
const fetchGitHubUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.github.com/users/${username}`);
        const user = response.data;
        //gets repos
        const reposUrl = `https://api.github.com/users/${username}/repos`;
        const reposResponse = yield axios_1.default.get(reposUrl);
        const repos = reposResponse.data;
        //get languages of repos
        const languagesPromises = repos.map((repo) => __awaiter(void 0, void 0, void 0, function* () {
            const languagesUrl = `https://api.github.com/repos/${username}/${repo.name}/languages`;
            const languagesResponse = yield axios_1.default.get(languagesUrl);
            return Object.keys(languagesResponse.data);
        }));
        const languages = (yield Promise.all(languagesPromises)).flat();
        user.languages = [...new Set(languages)];
        // console log user data
        console.log('\nGitHub User Info:');
        console.log(`Username: ${user.login}`);
        console.log(`Name: ${user.name || 'N/A'}`);
        console.log(`Bio: ${user.bio || 'N/A'}`);
        console.log(`Location: ${user.location || 'N/A'}`);
        console.log(`Public Repos: ${user.public_repos}`);
        console.log(`Languages: ${user.languages || 'N/A'}`);
        console.log(`Followers: ${user.followers}`);
        console.log(`Following: ${user.following}`);
        console.log(`Profile URL: ${user.html_url}`);
        // insert user db function
        yield (0, database_1.insertGitHubUser)(user);
    }
    catch (error) {
        console.error('Error. Please check the username and try again.');
    }
});
// validate user input
const isValidInput = (input) => {
    const trimmedInput = input.trim();
    return (trimmedInput.length > 0 &&
        trimmedInput.length <= 255 &&
        /^[a-zA-Z0-9 ]*$/.test(trimmedInput));
};
//fetch by location
const fetchByLocation = () => __awaiter(void 0, void 0, void 0, function* () {
    const location = yield new Promise((resolve) => {
        rl.question('Enter a Location: ', resolve);
    });
    //check input
    if (!isValidInput(location)) {
        console.log('Invalid location. Please enter a valid location.');
        return;
    }
    yield (0, database_1.fetchUsersByLocation)(location);
});
//fetch by language
const fetchByLanguage = () => __awaiter(void 0, void 0, void 0, function* () {
    const language = yield new Promise((resolve) => {
        rl.question('Enter a Language: ', resolve);
    });
    //check input
    if (!isValidInput(language)) {
        console.log('Invalid language. Please enter a valid language.');
        return;
    }
    yield (0, database_1.fetchUsersByLanguage)(language);
});
//fetch menu
const FetchMenu = () => {
    console.log('Select an option:');
    console.log('1 - Fetch for Location');
    console.log('2 - Fetch for Language');
    rl.question('Enter your choice: ', (choice) => __awaiter(void 0, void 0, void 0, function* () {
        switch (choice) {
            case '1':
                yield fetchByLocation();
                showMenu();
                break;
            case '2':
                yield fetchByLanguage();
                showMenu();
                break;
            default:
                console.log('Invalid option. Please try again.');
                FetchMenu();
                break;
        }
    }));
};
//user search
const handleSearchUsername = () => __awaiter(void 0, void 0, void 0, function* () {
    const username = yield new Promise((resolve) => {
        rl.question('Enter a GitHub username: ', resolve);
    });
    if (!isValidInput(username)) {
        console.log('Invalid username. Please enter a valid username.');
        return;
    }
    yield fetchGitHubUser(username);
});
// main menu function
const showMenu = () => {
    console.log('\nMenu:');
    console.log('1 - Search Username');
    console.log('2 - Fetch All Searched Users');
    console.log('3 - Fetch Searched Users by Location or Language');
    console.log('4 - Exit');
    rl.question('Choose an option: ', (option) => __awaiter(void 0, void 0, void 0, function* () {
        switch (option) {
            case '1':
                yield handleSearchUsername();
                showMenu();
                break;
            case '2':
                yield (0, database_1.fetchAllUsers)();
                showMenu();
                break;
            case '3':
                FetchMenu();
                break;
            case '4':
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
// menu loop
showMenu();
