import axios from 'axios';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

interface GitHubUser {
    name: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
}

const fetchGitHubUser = async (username: string): Promise<void> => {
    try {
        const response = await axios.get<GitHubUser>(`https://api.github.com/users/${username}`);
        const user = response.data;
        
        console.log('\nGitHub User Info:');
        console.log(`Name: ${user.name || 'N/A'}`);
        console.log(`Bio: ${user.bio || 'N/A'}`);
        console.log(`Public Repos: ${user.public_repos}`);
        console.log(`Followers: ${user.followers}`);
        console.log(`Following: ${user.following}`);
        console.log(`Profile URL: ${user.html_url}`);
    } catch (error) {
        console.error('Error fetching user data. Please check the username and try again.');
    }
};

const main = async (): Promise<void> => {
    rl.question('Enter a GitHub username: ', async (username: string) => {
        await fetchGitHubUser(username);
        rl.close();
    });
};

main();
