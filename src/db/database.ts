/* eslint-disable max-len, indent, quotes */
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import { GitHubUser } from '../types/types';

dotenv.config();

const pgp = pgPromise();
const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  throw new Error('Missing DB_URL in environment variables');
}
const db = pgp(dbUrl);
export default db;

export const insertGitHubUser = async (user: GitHubUser): Promise<void> => {
  try {
    await db.none(
      `INSERT INTO users (
        username, name, bio, location, public_repos, languages,
        followers, following, html_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (username)
      DO UPDATE SET
        name = EXCLUDED.name,
        bio = EXCLUDED.bio,
        location = EXCLUDED.location,
        public_repos = EXCLUDED.public_repos,
        languages = EXCLUDED.languages,
        followers = EXCLUDED.followers,
        following = EXCLUDED.following,
        html_url = EXCLUDED.html_url`,
      [
        user.login, user.name, user.bio, user.location,
        user.public_repos, user.languages, user.followers,
        user.following, user.html_url,
      ]
    );
    console.log('\nUser data inserted/updated successfully.');
  } catch (error) {
    console.error('Error inserting/updating data:', error);
  }
};

const logUser = (user: any): void => {
  console.log(`\nID: ${user.id},`);
  console.log(`Username: ${user.username},`);
  console.log(`Name: ${user.name},`);
  console.log(`Bio: ${user.bio},`);
  console.log(`Location: ${user.location},`);
  console.log(`Public Repos: ${user.public_repos},`);
  console.log(`Languages: ${user.languages},`);
  console.log(`Followers: ${user.followers},`);
  console.log(`Following: ${user.following},`);
  console.log(`Profile URL: ${user.html_url}\n`);
};

export const fetchAllUsers = async (): Promise<void> => {
  try {
    const users = await db.any('SELECT * FROM users');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log('\nAll Searched GitHub Users:');
      users.forEach(logUser);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const fetchUsersByLocation = async (
  location: string
): Promise<void> => {
  try {
    const users = await db.any(
      'SELECT * FROM users WHERE location = $1',
      location
    );
    if (users.length === 0) {
      console.log('No users found with that location.');
    } else {
      console.log('\nUsers with the given Location:');
      users.forEach(logUser);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const fetchUsersByLanguage = async (
  language: string
): Promise<void> => {
  try {
    const users = await db.any(
      'SELECT * FROM users WHERE $1 = ANY(languages)',
      language
    );
    if (users.length === 0) {
      console.log('No users found with that language.');
    } else {
      console.log('\nUsers with the given Languages:');
      users.forEach(logUser);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
