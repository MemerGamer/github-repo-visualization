export interface Repository {
    name: string;
    languages: string[];
    commits: number;
    url: string;
    fork: boolean;
}

export interface RawGitHubRepo {
    name: string;
    html_url: string;
    fork: boolean;
}
