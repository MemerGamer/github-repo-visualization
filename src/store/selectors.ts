import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { githubApi } from './githubApi';

export const selectCommittedUsername = (state: RootState) => state.ui.committedUsername;
export const selectInputUsername = (state: RootState) => state.ui.inputUsername;
export const selectLayout = (state: RootState) => state.ui.layout;
export const selectHiddenLanguages = (state: RootState) => state.ui.hiddenLanguages;
export const selectHiddenForks = (state: RootState) => state.ui.hiddenForks;
export const selectTechColors = (state: RootState) => state.colors.techColors;

export const selectRepositoriesResult = (username: string) =>
    githubApi.endpoints.getEnrichedUserRepos.select(username);

export const selectLanguageUsage = createSelector(
    (repos: { name: string; languages: string[] }[]) => repos,
    (repos) =>
        repos.reduce((acc, repo) => {
            for (const lang of repo.languages) {
                acc[lang] = (acc[lang] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>)
);
