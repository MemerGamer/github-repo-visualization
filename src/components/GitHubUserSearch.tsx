import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Repository } from '../types';
import GraphComponent from './GraphComponent';
import SearchBar from './SearchBar';
import LanguageListComponent from './LanguageListComponent';
import SkeletonLoader from './SkeletonLoader';

const GitHubUserSearch: React.FC = () => {
    const navigate = useNavigate();
    const { usernameParam, layoutParam } = useParams();

    const [inputUsername, setInputUsername] = useState<string>(usernameParam || '');
    const [username, setUsername] = useState<string>(usernameParam || '');

    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [layout, setLayout] = useState<string>(layoutParam || 'grid');
    const [loading, setLoading] = useState<boolean>(false);
    const cyRef = useRef<HTMLDivElement>(null);
    const [techColors, setTechColors] = useState<Map<string, string>>(new Map());
    const [languageUsage, setLanguageUsage] = useState<Map<string, number>>(new Map());
    const [hiddenLanguages, setHiddenLanguages] = useState<Set<string>>(new Set());
    const [hiddenForks, setHiddenForks] = useState<boolean>(true);
    const usedColors = useRef<Set<string>>(new Set());

    const getRandomColor = useCallback(() => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }, []);

    const toggleLanguageVisibility = (language: string) => {
        setHiddenLanguages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(language)) {
                newSet.delete(language);
            } else {
                newSet.add(language);
            }
            return newSet;
        });
    };

    const getRandomUniqueColor = useCallback(() => {
        let color;
        do {
            color = getRandomColor();
        } while (usedColors.current.has(color));
        usedColors.current.add(color);
        return color;
    }, [getRandomColor]);

    const updateRoute = useCallback(() => {
        navigate(`/${username}/${layout}`);
    }, [navigate, username, layout]);

    const fetchRepositories = useCallback(async (user: string) => {
        setLoading(true);
        setError(null);
        setRepositories([]);
        setLanguageUsage(new Map());

        try {
            const reposResponse = await axios.get(
                `${import.meta.env.VITE_GITHUB_API_URL}/users/${user}/repos`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
                    },
                }
            );

            const repoData: Repository[] = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                reposResponse.data.map(async (repo: any) => {
                    const languagesResponse = await axios.get(
                        `${import.meta.env.VITE_GITHUB_API_URL}/repos/${user}/${repo.name}/languages`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
                            },
                        }
                    );
                    const languages = Object.keys(languagesResponse.data);

                    let commits = 0;
                    try {
                        const commitsResponse = await axios.get(
                            `${import.meta.env.VITE_GITHUB_API_URL}/repos/${user}/${repo.name}/commits?per_page=1&page=1`,
                            {
                                headers: {
                                    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
                                },
                            }
                        );

                        const linkHeader = commitsResponse.headers.link;
                        if (linkHeader) {
                            const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                            if (match && match[1]) {
                                commits = parseInt(match[1], 10);
                            }
                        } else {
                            commits = 1;
                        }
                    } catch (commitError) {
                        console.error(`Error fetching commit count for ${repo.name}:`, commitError);
                    }

                    languages.forEach((language) => {
                        setLanguageUsage((prev) => {
                            const newCount = (prev.get(language) || 0) + 1;
                            return new Map(prev).set(language, newCount);
                        });
                    });

                    return {
                        name: repo.name,
                        languages,
                        commits,
                        url: repo.html_url,
                        fork: repo.fork,
                    };
                })
            );

            setRepositories(repoData);

            const colors = new Map<string, string>();
            usedColors.current.clear();
            repoData.forEach((repo) => {
                repo.languages.forEach((tech) => {
                    if (!colors.has(tech)) {
                        colors.set(tech, getRandomUniqueColor());
                    }
                });
            });
            setTechColors(colors);

        } catch (error) {
            setError('Error fetching repositories or technologies.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    },[getRandomUniqueColor]);

    useEffect(() => {
        if (usernameParam) {
            fetchRepositories(usernameParam);
        }
    }, [fetchRepositories, usernameParam]);

    const handleSearch = () => {
        if (inputUsername && inputUsername !== username) {
            setUsername(inputUsername);
            fetchRepositories(inputUsername);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 h-screen w-screen bg-gray-900 transition-colors duration-300">
            <SearchBar
                username={inputUsername}
                setUsername={setInputUsername}
                layout={layout}
                setLayout={setLayout} // Change layout without fetching
                handleSearch={handleSearch}
                updateRoute={updateRoute}
            />
            {error && <p className="mt-4 text-red-400">{error}</p>}
            {loading ? (
                <SkeletonLoader />
            ) : (
                <div className="flex w-full h-[85vh]">
                    <GraphComponent
                        repositories={repositories}
                        layout={layout}
                        cyRef={cyRef}
                        techColors={techColors}
                        hiddenLanguages={hiddenLanguages}
                        hiddenForks={hiddenForks}
                    />
                    <LanguageListComponent
                        techColors={techColors}
                        languageUsage={languageUsage}
                        hiddenLanguages={hiddenLanguages}
                        toggleLanguageVisibility={toggleLanguageVisibility}
                        hiddenForks={hiddenForks}
                        toggleForkVisibility={() => setHiddenForks((prev) => !prev)}
                    />
                </div>
            )}
        </div>
    );
};

export default GitHubUserSearch;