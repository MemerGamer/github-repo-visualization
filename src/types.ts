interface Repository {
  name: string;
  languages: string[];
  commits: number;
  url: string;
  fork: boolean;
}

export type { Repository };
