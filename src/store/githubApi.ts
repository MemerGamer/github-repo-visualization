import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { Repository } from '../types';

const API_URL = import.meta.env.VITE_GITHUB_API_URL as string;
const API_KEY = import.meta.env.VITE_GITHUB_API_KEY as string;

const authHeaders = {
    Authorization: `Bearer ${API_KEY}`,
};

export const githubApi = createApi({
    reducerPath: 'githubApi',
    baseQuery: fakeBaseQuery(),
    keepUnusedDataFor: 300, // 5-minute cache
    endpoints: (builder) => ({
        getEnrichedUserRepos: builder.query<Repository[], string>({
            queryFn: async (username) => {
                try {
                    const reposResponse = await axios.get(
                        `${API_URL}/users/${username}/repos`,
                        { headers: authHeaders }
                    );

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const repoData: Repository[] = await Promise.all(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        reposResponse.data.map(async (repo: any) => {
                            const [languagesResponse, commitsResponse] = await Promise.allSettled([
                                axios.get(
                                    `${API_URL}/repos/${username}/${repo.name}/languages`,
                                    { headers: authHeaders }
                                ),
                                axios.get(
                                    `${API_URL}/repos/${username}/${repo.name}/commits?per_page=1&page=1`,
                                    { headers: authHeaders }
                                ),
                            ]);

                            const languages =
                                languagesResponse.status === 'fulfilled'
                                    ? Object.keys(languagesResponse.value.data)
                                    : [];

                            let commits = 0;
                            if (commitsResponse.status === 'fulfilled') {
                                const linkHeader = commitsResponse.value.headers.link;
                                if (linkHeader) {
                                    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                                    if (match && match[1]) {
                                        commits = parseInt(match[1], 10);
                                    }
                                } else {
                                    commits = 1;
                                }
                            }

                            return {
                                name: repo.name,
                                languages,
                                commits,
                                url: repo.html_url,
                                fork: repo.fork,
                            };
                        })
                    );

                    return { data: repoData };
                } catch (error) {
                    return { error: { status: 'FETCH_ERROR', error: String(error) } };
                }
            },
        }),
    }),
});

export const { useGetEnrichedUserReposQuery } = githubApi;
