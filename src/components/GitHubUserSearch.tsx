import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Repository } from '../types';
import GraphComponent from './GraphComponent';
import SearchBar from './SearchBar';
import LanguageListComponent from './LanguageListComponent';
import SkeletonLoader from './SkeletonLoader';

const GitHubUserSearch: React.FC = () => {
    const { usernameParam, layoutParam } = useParams<{ usernameParam: string; layoutParam: string }>();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>(usernameParam || '');
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [layout, setLayout] = useState<string>(layoutParam || 'grid');
    const [loading, setLoading] = useState<boolean>(false);
    const cyRef = useRef<HTMLDivElement>(null);
    const [techColors, setTechColors] = useState<Map<string, string>>(new Map());
    const [languageUsage, setLanguageUsage] = useState<Map<string, number>>(new Map());
    const [hiddenLanguages, setHiddenLanguages] = useState<Set<string>>(new Set());
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

    const handleSearch = useCallback(async () => {
        setError(null);
        setRepositories([]);
        setLanguageUsage(new Map());
        setLoading(true);
        if (!username) {
            setLoading(false);
            return;
        }

        try {
            const reposResponse = await axios.get(
                `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}/repos`,
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
                        `${import.meta.env.VITE_GITHUB_API_URL}/repos/${username}/${repo.name}/languages`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
                            },
                        }
                    );
                    const languages = Object.keys(languagesResponse.data);

                    const commitsResponse = await axios.get(
                        `${import.meta.env.VITE_GITHUB_API_URL}/repos/${username}/${repo.name}/commits`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
                            },
                        }
                    );
                    const commits = commitsResponse.data.length;

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
                        url: repo.html_url
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

            updateRoute();
        } catch (error) {
            setError('Error fetching repositories or technologies.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [username, updateRoute, getRandomUniqueColor]);

    useEffect(() => {
        if (usernameParam) {
            handleSearch();
        }
    }, [usernameParam, handleSearch]);

    return (
        <div className="flex flex-col items-center p-6 h-screen w-screen bg-gray-900 transition-colors duration-300">
            <SearchBar
                username={username}
                setUsername={setUsername}
                layout={layout}
                setLayout={setLayout}
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
                    />
                    <LanguageListComponent
                        techColors={techColors}
                        languageUsage={languageUsage}
                        hiddenLanguages={hiddenLanguages}
                        toggleLanguageVisibility={toggleLanguageVisibility}
                    />
                </div>
            )}
        </div>
    );
};

export default GitHubUserSearch;