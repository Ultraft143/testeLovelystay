import axios from 'axios';
import * as readline from 'readline';
import { insertGitHubUser, fetchAllUsers } from './database';

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

interface GitHubUser {
    login: string;
    name: string | null;
    bio: string | null;
    location: string | null;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
}

// Function to fetch GitHub user data
const fetchGitHubUser = async (username: string): Promise<void> => {
    try {
        const response = await axios.get<GitHubUser>(`https://api.github.com/users/${username}`);
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
        await insertGitHubUser(user);
    } catch (error) {
        console.error('Error fetching user data. Please check the username and try again.');
    }
};

// Main menu function
const showMenu = (): void => {
    console.log('\nMenu:');
    console.log('1 - Search Username');
    console.log('2 - Fetch All Searched Users');
    console.log('3 - Exit');

    rl.question('Choose an option: ', async (option: string) => {
        switch (option) {
            case '1':
                rl.question('Enter a GitHub username: ', async (username: string) => {
                    await fetchGitHubUser(username);
                    showMenu();
                });
                break;
            case '2':
                await fetchAllUsers();
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
    });
};

// Start the menu loop
showMenu();
