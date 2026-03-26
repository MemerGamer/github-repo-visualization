import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { toggleLanguage, toggleForks } from '../../store/uiSlice';
import {
    selectTechColors,
    selectHiddenLanguages,
    selectHiddenForks,
    selectCommittedUsername,
    selectLanguageUsage,
} from '../../store/selectors';
import { useGetEnrichedUserReposQuery } from '../../store/githubApi';
import LanguageItem from '../molecules/LanguageItem';
import LanguageFilterItem from '../molecules/LanguageFilterItem';
import ForkToggle from '../molecules/ForkToggle';

const LanguageList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const techColors = useSelector(selectTechColors);
    const hiddenLanguages = useSelector(selectHiddenLanguages);
    const hiddenForks = useSelector(selectHiddenForks);
    const committedUsername = useSelector(selectCommittedUsername);

    const { data: repositories = [] } = useGetEnrichedUserReposQuery(
        committedUsername,
        { skip: !committedUsername }
    );

    const languageUsage = selectLanguageUsage(repositories);

    return (
        <div className="flex flex-col ml-4 w-1/6">
            <div className="text-white h-1/2 bg-gray-800 rounded-xl p-4 overflow-y-auto">
                <h2 className="text-lg mb-2">Languages <br /> (Nr. of repos using):</h2>
                <ul>
                    {Object.entries(techColors).map(([tech, color]) => (
                        <LanguageItem
                            key={tech}
                            language={tech}
                            color={color}
                            count={languageUsage[tech] || 0}
                        />
                    ))}
                </ul>
            </div>
            <div className="text-white h-1/2 bg-gray-800 rounded-xl p-4 overflow-y-auto mt-4">
                <h2 className="text-lg mb-2">Hide Forks:</h2>
                <ForkToggle
                    checked={hiddenForks}
                    onChange={() => dispatch(toggleForks())}
                />
                <h2 className="text-lg mt-4 mb-2">Hide Languages:</h2>
                <ul>
                    {Object.keys(languageUsage).map((language) => (
                        <LanguageFilterItem
                            key={language}
                            language={language}
                            checked={hiddenLanguages.includes(language)}
                            onChange={() => dispatch(toggleLanguage(language))}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LanguageList;
