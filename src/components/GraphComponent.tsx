import { useEffect } from "react";
import { Repository } from "../types";
import cytoscape from "cytoscape";

const GraphComponent: React.FC<{
    repositories: Repository[];
    layout: string;
    cyRef: React.RefObject<HTMLDivElement>;
    techColors: Map<string, string>;
    hiddenLanguages: Set<string>;
}> = ({ repositories, layout, cyRef, techColors, hiddenLanguages }) => {
    useEffect(() => {
        if (repositories.length === 0 || !cyRef.current) return;

        const elements: cytoscape.ElementDefinition[] = [];
        const techMap = new Map<string, string[]>();

        repositories.forEach((repo) => {
            // The size of the nodes should scale less when the number of commits is high
            const size = Math.log1p(repo.commits)*10 + repo.languages.length * 10 + 20;
            elements.push({
                data: {
                    id: repo.name,
                    label: `${repo.name}\n\nCommits: ${repo.commits}\nNr. of languages: ${repo.languages.length}`,
                    size,
                    url: repo.url
                },
            });

            repo.languages.forEach((tech) => {
                if (!techMap.has(tech)) {
                    techMap.set(tech, []);
                }
                techMap.get(tech)!.push(repo.name);
            });
        });

        techMap.forEach((repos, tech) => {
            if (repos.length > 1 && !hiddenLanguages.has(tech)) {
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
                        'text-wrap': 'wrap',
                        'text-max-width': '100px',
                        color: '#fff',
                        'font-size': '12px',
                        width: 'data(size)',
                        height: 'data(size)',
                        opacity: 1
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
                        opacity: 1
                    },
                },
                ...Array.from(techColors.entries()).map(([tech, color]) => ({
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
            if (url) {
                window.open(url, '_blank');
            }
        });

        return () => cy.destroy();
    }, [repositories, layout, hiddenLanguages, techColors, cyRef]);

    return (
        <div
            ref={cyRef}
            className="rounded-2xl flex-grow mtb-6 h-full bg-gray-800"
            style={{ minHeight: '400px' }}
        ></div>
    );
};

export default GraphComponent;