import pgPromise from 'pg-promise';

const pgp = pgPromise();
const db = pgp('postgres://postgres:123@localhost:5432/lovelystay');

export default db;

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

// Function to insert GitHub user data into the database
export const insertGitHubUser = async (user: GitHubUser): Promise<void> => {
    try {
        const checkUser = await db.any('SELECT * FROM users WHERE username = $1', user.login);
        if(checkUser.length != 0){
            console.log('User already exists on the database.');
        }
        else{
            await db.none(
                'INSERT INTO users(username, name, bio, location, public_repos, followers, following, html_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                [user.login, user.name, user.bio, user.location, user.public_repos, user.followers, user.following, user.html_url]
            );
            console.log('User data inserted into database successfully.');
        }
    } catch (error) {
        console.error('Error inserting data into the database:', error);
    }
};

// Function to fetch all users from the database
export const fetchAllUsers = async (): Promise<void> => {
    try {
        const users = await db.any('SELECT * FROM users');
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log('\nAll Searched GitHub Users:');
            users.forEach((user: any) => {
                console.log(`ID: ${user.id}, Username: ${user.username}, Name: ${user.name}, Bio: ${user.bio}, Location: ${user.location}, Public Repos: ${user.public_repos}, Followers: ${user.followers}, Following: ${user.following}, Profile URL: ${user.html_url}\n`);
            });
        }
    } catch (error) {
        console.error('Error fetching users from the database:', error);
    }
};
