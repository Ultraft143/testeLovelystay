import axios from 'axios';
import * as readline from 'readline';
import {
  insertGitHubUser,
  fetchAllUsers,
  fetchUsersByLocation,
  fetchUsersByLanguage
} from './database';

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
  languages: string[];
  followers: number;
  following: number;
  html_url: string;
}

// get user on git API
const fetchGitHubUser = async (username: string): Promise<void> => {
  try {
    const response = await axios.get<GitHubUser>(
      `https://api.github.com/users/${username}`
    );
    const user = response.data;

    //gets repos
    const reposUrl = `https://api.github.com/users/${username}/repos`;
    const reposResponse = await axios.get(reposUrl);
    const repos = reposResponse.data;

    //get languages of repos
    const languagesPromises = repos.map(async (repo: any) => {
      const languagesUrl = `https://api.github.com/repos/${username}/${
        repo.name
      }/languages`;
      const languagesResponse = await axios.get(languagesUrl);
      return Object.keys(languagesResponse.data);
    });

    const languages = (await Promise.all(languagesPromises)).flat();

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
    await insertGitHubUser(user);
  } catch (error) {
    console.error('Error. Please check the username and try again.');
  }
};

// validate user input
const isValidInput = (input: string): boolean => {
  const trimmedInput = input.trim();
  return (
    trimmedInput.length > 0 &&
    trimmedInput.length <= 255 &&
    /^[a-zA-Z0-9 ]*$/.test(trimmedInput)
  );
};

//fetch by location
const fetchByLocation = async () => {
  const location = await new Promise<string>((resolve) => {
    rl.question('Enter a Location: ', resolve);
  });

  //check input
  if (!isValidInput(location)) {
    console.log('Invalid location. Please enter a valid location.');
    return;
  }

  await fetchUsersByLocation(location);
};

//fetch by language
const fetchByLanguage = async () => {
  const language = await new Promise<string>((resolve) => {
    rl.question('Enter a Language: ', resolve);
  });

  //check input
  if (!isValidInput(language)) {
    console.log('Invalid language. Please enter a valid language.');
    return;
  }

  await fetchUsersByLanguage(language);
};

//fetch menu
const FetchMenu = () => {
  console.log('Select an option:');
  console.log('1 - Fetch for Location');
  console.log('2 - Fetch for Language');

  rl.question('Enter your choice: ', async (choice: string) => {
    switch (choice) {
      case '1':
        await fetchByLocation();
        showMenu();
        break;
      case '2':
        await fetchByLanguage();
        showMenu();
        break;
      default:
        console.log('Invalid option. Please try again.');
        FetchMenu();
        break;
    }
  });
};

//user search
const handleSearchUsername = async () => {
  const username = await new Promise<string>((resolve) => {
    rl.question('Enter a GitHub username: ', resolve);
  });

  if (!isValidInput(username)) {
    console.log('Invalid username. Please enter a valid username.');
    return;
  }

  await fetchGitHubUser(username);
};

// main menu function
const showMenu = (): void => {
  console.log('\nMenu:');
  console.log('1 - Search Username');
  console.log('2 - Fetch All Searched Users');
  console.log('3 - Fetch Searched Users by Location or Language');
  console.log('4 - Exit');

  rl.question('Choose an option: ', async (option: string) => {
    switch (option) {
      case '1':
        await handleSearchUsername();
        showMenu();
        break;
      case '2':
        await fetchAllUsers();
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
  });
};

// menu loop
showMenu();
