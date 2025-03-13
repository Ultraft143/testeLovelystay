export interface GitHubUser {
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
  