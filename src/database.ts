import pgPromise from 'pg-promise';

//database connection
const pgp = pgPromise();
const db = pgp('postgres://postgres:123@localhost:5432/lovelystay');

export default db;

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

// Insert user to db
export const insertGitHubUser = async (user: GitHubUser): Promise<void> => {
  try {
    const checkUser = await db.any(
      'SELECT * FROM users WHERE username = $1',
      user.login
    );
    if (checkUser.length !== 0) {
      await db.none(
        `UPDATE users SET 
          name = $2, 
          bio = $3, 
          location = $4, 
          public_repos = $5, 
          languages = $6, 
          followers = $7, 
          following = $8, 
          html_url = $9 
        WHERE username = $1`,
        [
          user.login,
          user.name,
          user.bio,
          user.location,
          user.public_repos,
          user.languages,
          user.followers,
          user.following,
          user.html_url,
        ]
      );
      console.log('User data updated successfully.');
    } else {
      await db.none(
        `INSERT INTO users(
          username, name, bio, location, public_repos, languages, followers, 
          following, html_url) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          user.login,
          user.name,
          user.bio,
          user.location,
          user.public_repos,
          user.languages,
          user.followers,
          user.following,
          user.html_url,
        ]
      );
      console.log('User data inserted into database successfully.');
    }
  } catch (error) {
    console.error('Error inserting data into the database:', error);
  }
};

// show users on db
export const fetchAllUsers = async (): Promise<void> => {
  try {
    const users = await db.any('SELECT * FROM users');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log('\nAll Searched GitHub Users:');
      users.forEach((user: any) => {
        console.log(
          `ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, 
           Bio: ${user.bio}, Location: ${user.location}, Public Repos: 
           ${user.public_repos}, Languages: ${user.languages}, Followers: 
           ${user.followers}, Following: ${user.following}, Profile URL: 
           ${user.html_url}\n`
        );
      });
    }
  } catch (error) {
    console.error('Error fetching users from the database:', error);
  }
};

// show users by given location
export const fetchUsersByLocation = async (location: string): Promise<void> => {
  try {
    const users = await db.any('SELECT * FROM users WHERE location = $1', location);
    if (users.length === 0) {
      console.log('No users found in the database with that location.');
    } else {
      console.log('\nAll Searched GitHub Users with the given Location:');
      users.forEach((user: any) => {
        console.log(
          `ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, 
           Bio: ${user.bio}, Location: ${user.location}, Public Repos: 
           ${user.public_repos}, Languages: ${user.languages}, Followers: 
           ${user.followers}, Following: ${user.following}, Profile URL: 
           ${user.html_url}\n`
        );
      });
    }
  } catch (error) {
    console.error('Error fetching users from the database:', error);
  }
};

// show users by given language
export const fetchUsersByLanguage = async (language: string): Promise<void> => {
  try {
    const users = await db.any('SELECT * FROM users WHERE $1 = ANY(languages)', language);
    if (users.length === 0) {
      console.log('No users found in the database with that language.');
    } else {
      console.log('\nAll Searched GitHub Users with the given Languages:');
      users.forEach((user: any) => {
        console.log(
          `ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, 
           Bio: ${user.bio}, Location: ${user.location}, Public Repos: 
           ${user.public_repos}, Languages: ${user.languages}, Followers: 
           ${user.followers}, Following: ${user.following}, Profile URL: 
           ${user.html_url}\n`
        );
      });
    }
  } catch (error) {
    console.error('Error fetching users from the database:', error);
  }
};
