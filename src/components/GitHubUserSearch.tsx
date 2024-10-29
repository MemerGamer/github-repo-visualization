import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import cytoscape from 'cytoscape';

interface Repository {
    name: string;
    languages: string[];
    commits: number;
}

const GitHubUserSearch: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [layout, setLayout] = useState<string>('cose');
    const cyRef = useRef<HTMLDivElement>(null);
    const [techColors, setTechColors] = useState<Map<string, string>>(new Map());

    const handleSearch = async () => {
        setError(null);
        setRepositories([]);
        if (!username) return;

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

                    return {
                        name: repo.name,
                        languages,
                        commits,
                    };
                })
            );

            setRepositories(repoData);
        } catch (error) {
            setError('Error fetching repositories or technologies.');
            console.error(error);
        }
    };

    useEffect(() => {
        if (repositories.length === 0 || !cyRef.current) return;

        const elements: cytoscape.ElementDefinition[] = [];
        const techMap = new Map<string, string[]>();
        const colors = new Map<string, string>();

        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        repositories.forEach((repo) => {
            const size = repo.commits + repo.languages.length * 10 + 20;
            elements.push({
                data: { id: repo.name, label: repo.name, size },
            });

            repo.languages.forEach((tech) => {
                if (!techMap.has(tech)) {
                    techMap.set(tech, []);
                    colors.set(tech, getRandomColor());
                }
                techMap.get(tech)!.push(repo.name);
            });
        });

        setTechColors(colors);

        techMap.forEach((repos, tech) => {
            if (repos.length > 1) {
                for (let i = 0; i < repos.length; i++) {
                    for (let j = i + 1; j < repos.length; j++) {
                        elements.push({
                            data: {
                                id: `${repos[i]}-${repos[j]}`,
                                source: repos[i],
                                target: repos[j],
                                label: tech,
                            },
                            classes: tech,
                        });
                    }
                }
            }
        });

        const cy = cytoscape({
            container: cyRef.current,
            elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#007acc',
                        label: 'data(label)',
                        'text-valign': 'center',
                        color: '#fff',
                        'font-size': '12px',
                        width: 'data(size)',
                        height: 'data(size)',
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 1,
                        'line-color': '#ddd',
                        'curve-style': 'unbundled-bezier',
                        label: 'data(label)',
                        'font-size': '10px',
                        'text-background-color': '#fff',
                        'text-background-opacity': 1,
                        'text-background-shape': 'roundrectangle',
                    },
                },
                ...Array.from(colors.entries()).map(([tech, color]) => ({
                    selector: `edge.${tech}`,
                    style: {
                        'line-color': color,
                        'text-background-color': color,
                    },
                })),
            ],
            layout: {
                name: layout,
            },
        });

        return () => cy.destroy();
    }, [repositories, layout]);

    return (
        <div className="flex flex-col items-center p-6 h-screen w-screen bg-gray-900 transition-colors duration-300">
            <div className="flex justify-center w-full max-w-lg mb-4">
                <h1 className='text-white text-lg align-middle justify-center p-2'>GitHub Username:</h1>
                <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200"
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Search
                </button>

                <h1 className='text-white text-lg align-middle justify-center p-2'>Graph Layout:</h1>
                <select
                    title='layout-select'
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    className="ml-2 p-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200"
                >
                    <option value="cose">Cose</option>
                    <option value="grid">Grid</option>
                    <option value="breadthfirst">Breadthfirst</option>
                    <option value="concentric">Concentric</option>
                    <option value="circle">Circle</option>
                </select>
            </div>

            {error && <p className="mt-4 text-red-400">{error}</p>}

            <div
                ref={cyRef}
                className="rounded-2xl flex-grow w-full mt-6 h-full bg-gray-800"
                style={{ minHeight: '400px' }}
            ></div>

            {/* Put on top of the graph and align to the right */}
            <div className="absolute top-28 right-0 mt-4 mr-4 text-white max-h-96 bg-gray-900 bg-opacity-75 rounded-xl p-2 overflow-y-auto">
                <h2 className="text-lg mb-2">Legend:</h2>
                <ul>
                    {Array.from(techColors.entries()).map(([tech, color]) => (
                        <li key={tech} style={{ color }}>
                            {tech}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GitHubUserSearch;