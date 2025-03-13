import prompts from 'prompts';
import { fetchGitHubUser } from '../api/gitApi';
import { 
  fetchAllUsers,
  fetchUsersByLocation,
  fetchUsersByLanguage 
} from '../db/database';

// Validate user input
const isValidInput = (input: string): boolean => {
  const trimmedInput = input.trim();
  return (
    trimmedInput.length > 0 &&
    trimmedInput.length <= 255 &&
    /^[a-zA-Z0-9 ]*$/.test(trimmedInput)
  );
};

// User search
const handleSearchUsername = async () => {
  const response = await prompts({
    type: 'text',
    name: 'username',
    message: 'Enter a GitHub username:'
  });
  
  const username = response.username;
  if (!isValidInput(username)) {
    console.log('Invalid username. Please enter a valid username.');
    return;
  }
  
  const user = await fetchGitHubUser(username);
  if (user) {
    console.log('\nGitHub User Info:');
    console.log(`Username: ${user.login}`);
    console.log(`Name: ${user.name || 'N/A'}`);
    console.log(`Bio: ${user.bio || 'N/A'}`);
    console.log(`Location: ${user.location || 'N/A'}`);
    console.log(`Public Repos: ${user.public_repos}`);
    console.log(`Languages: ${user.languages || 'N/A'}`);
    console.log(`Followers: ${user.followers}`);
    console.log(`Following: ${user.following}`);
    console.log(`Profile URL: ${user.html_url}\n`);
  }
};

const fetchByLocation = async () => {
  const response = await prompts({
    type: 'text',
    name: 'location',
    message: 'Enter a Location:'
  });
  
  const location = response.location;
  if (!isValidInput(location)) {
    console.log('Invalid location. Please enter a valid location.');
    return;
  }
  await fetchUsersByLocation(location);
};

const fetchByLanguage = async () => {
  const response = await prompts({
    type: 'text',
    name: 'language',
    message: 'Enter a Language:'
  });
  
  const language = response.language;
  if (!isValidInput(language)) {
    console.log('Invalid language. Please enter a valid language.');
    return;
  }
  await fetchUsersByLanguage(language);
};

// Fetch menu
const fetchMenu = async () => {
  const response = await prompts({
    type: 'select',
    name: 'choice',
    message: 'Select an option:',
    choices: [
      { title: 'Fetch for Location', value: '1' },
      { title: 'Fetch for Language', value: '2' }
    ]
  });

  switch (response.choice) {
    case '1':
      await fetchByLocation();
      break;
    case '2':
      await fetchByLanguage();
      break;
    default:
      console.log('Invalid option. Please try again.');
      break;
  }
};

const showMenu = async (): Promise<void> => {
  let running = true;

  while (running) {
    const response = await prompts({
      type: 'select',
      name: 'option',
      message: 'Choose an option:',
      choices: [
        { title: 'Search Username', value: '1' },
        { title: 'Fetch All Searched Users', value: '2' },
        { title: 'Fetch by Location or Language', value: '3' },
        { title: 'Exit', value: '4' }
      ]
    });

    switch (response.option) {
      case '1':
        await handleSearchUsername();
        break;
      case '2':
        await fetchAllUsers();
        break;
      case '3':
        await fetchMenu();
        break;
      case '4':
        console.log('Goodbye!');
        running = false;
        break;
      default:
        console.log('Invalid option. Please try again.');
        break;
    }
  }
};

export default showMenu;
