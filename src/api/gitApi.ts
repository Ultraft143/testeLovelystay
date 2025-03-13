import axios from 'axios';
import { GitHubUser } from '../types/types';
import { insertGitHubUser } from '../db/database';

export const fetchGitHubUser = async (
  username: string
): Promise<GitHubUser | null> => {
  try {
    const { data: user } = await axios.get<GitHubUser>(
      `https://api.github.com/users/${username}`
    );

    // Fetch user repositories
    const reposUrl = `https://api.github.com/users/${username}/repos`;
    const { data: repos } = await axios.get(reposUrl);

    // Fetch languages from repositories
    const languagesPromises = repos.map(async (repo: any) => {
      const langUrl = `https://api.github.com/repos/${username}/${
        repo.name
      }/languages`;
      const { data: langData } = await axios.get(langUrl);
      return Object.keys(langData);
    });

    const languages = (await Promise.all(languagesPromises)).flat();
    user.languages = [...new Set(languages)];

    await insertGitHubUser(user);
    return user;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
};
