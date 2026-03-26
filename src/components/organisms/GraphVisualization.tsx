import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetEnrichedUserReposQuery } from '../../store/githubApi';
import {
    selectCommittedUsername,
    selectLayout,
    selectTechColors,
    selectHiddenLanguages,
    selectHiddenForks,
} from '../../store/selectors';
import cytoscape from 'cytoscape';

const safeName = (lang: string) => lang.replace(/[^a-zA-Z0-9_-]/g, '_');

const GraphVisualization: React.FC = () => {
    const cyRef = useRef<HTMLDivElement>(null);

    const committedUsername = useSelector(selectCommittedUsername);
    const layout = useSelector(selectLayout);
    const techColors = useSelector(selectTechColors);
    const hiddenLanguages = useSelector(selectHiddenLanguages);
    const hiddenForks = useSelector(selectHiddenForks);

    const { data: repositories = [] } = useGetEnrichedUserReposQuery(
        committedUsername,
        { skip: !committedUsername }
    );

    useEffect(() => {
        if (repositories.length === 0 || !cyRef.current) return;

        const elements: cytoscape.ElementDefinition[] = [];
        const techMap = new Map<string, string[]>();

        repositories
            .filter((repo) => !hiddenForks || !repo.fork)
            .forEach((repo) => {
                const size = Math.log1p(repo.commits) * 10 + repo.languages.length * 10 + 20;
                elements.push({
                    data: {
                        id: repo.name,
                        label: `${repo.name}\n\nCommits: ${repo.commits}\nNr. of languages: ${repo.languages.length}`,
                        size,
                        url: repo.url,
                    },
                });

                repo.languages.forEach((tech) => {
                    if (!techMap.has(tech)) techMap.set(tech, []);
                    techMap.get(tech)!.push(repo.name);
                });
            });

        techMap.forEach((repos, tech) => {
            if (repos.length > 1 && !hiddenLanguages.includes(tech)) {
                for (let i = 0; i < repos.length; i++) {
                    for (let j = i + 1; j < repos.length; j++) {
                        elements.push({
                            data: {
                                id: `${repos[i]}-${repos[j]}`,
                                source: repos[i],
                                target: repos[j],
                                label: tech,
                            },
                            classes: safeName(tech),
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
                        'text-wrap': 'wrap',
                        'text-max-width': '100px',
                        color: '#fff',
                        'font-size': '12px',
                        width: 'data(size)',
                        height: 'data(size)',
                        opacity: 1,
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
                        opacity: 1,
                    },
                },
                ...Object.entries(techColors).map(([tech, color]) => ({
                    selector: `edge.${safeName(tech)}`,
                    style: {
                        'line-color': color,
                        'text-background-color': color,
                    },
                })),
            ],
            layout: { name: layout },
        });

        cy.on('mouseover', 'node', (event) => {
            const node = event.target;
            cy.elements().not(node).not(node.connectedEdges()).style({ opacity: 0.1 });
            node.style({ opacity: 1 });
            node.connectedEdges().style({ opacity: 1 });
            node.connectedEdges().connectedNodes().style({ opacity: 1 });
        });

        cy.on('mouseout', 'node', () => {
            cy.elements().style({ opacity: 1 });
        });

        cy.on('dblclick', 'node', (event) => {
            const node = event.target;
            const url = node.data('url');
            if (url) window.open(url, '_blank');
        });

        return () => cy.destroy();
    }, [repositories, layout, hiddenLanguages, techColors, hiddenForks]);

    return (
        <div
            ref={cyRef}
            className="rounded-2xl flex-grow h-full bg-gray-800"
            style={{ minHeight: '400px' }}
        />
    );
};

export default GraphVisualization;
