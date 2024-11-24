const LanguageListComponent: React.FC<{
    techColors: Map<string, string>;
    languageUsage: Map<string, number>;
    hiddenLanguages: Set<string>;
    toggleLanguageVisibility: (language: string) => void;
    hiddenForks: boolean;
    toggleForkVisibility: () => void;
}> = ({
    techColors,
    languageUsage,
    hiddenLanguages,
    toggleLanguageVisibility,
    hiddenForks,
    toggleForkVisibility,
}) => (
        <div className='flex flex-col ml-4 w-1/6'>
            <div className="text-white h-1/2 bg-gray-800 rounded-xl p-4 overflow-y-auto">
                <h2 className="text-lg mb-2">Languages <br></br> (Nr. of repos using):</h2>
                <ul>
                    {Array.from(techColors.entries()).map(([tech, color]) => (
                        <li key={tech} style={{ color }}>
                            {tech} ({languageUsage.get(tech) || 0})
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-white h-1/2 bg-gray-800 rounded-xl p-4 overflow-y-auto mt-4">
                {/* Hide Forks Checkbox */}
                <h2 className="text-lg mb-2">Hide Forks:</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={hiddenForks}
                        onChange={toggleForkVisibility}
                    />
                    Hide Forked Repositories
                </label>

                {/* Hide Languages Section */}
                <h2 className="text-lg mt-4 mb-2">Hide Languages:</h2>
                <ul>
                    {Array.from(languageUsage.keys()).map((language) => (
                        <li key={language}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={hiddenLanguages.has(language)}
                                    onChange={() => toggleLanguageVisibility(language)}
                                />
                                {language}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

export default LanguageListComponent;