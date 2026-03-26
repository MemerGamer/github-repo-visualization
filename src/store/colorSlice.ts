import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { githubApi } from './githubApi';
import { Repository } from '../types';

export type TechColors = Record<string, string>;

interface ColorState {
    techColors: TechColors;
}

const initialState: ColorState = {
    techColors: {},
};

function getRandomColor(usedColors: Set<string>): string {
    const letters = '0123456789ABCDEF';
    let color: string;
    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    } while (usedColors.has(color));
    usedColors.add(color);
    return color;
}

function buildTechColors(repos: Repository[]): TechColors {
    const colors: TechColors = {};
    const usedColors = new Set<string>();
    for (const repo of repos) {
        for (const lang of repo.languages) {
            if (!(lang in colors)) {
                colors[lang] = getRandomColor(usedColors);
            }
        }
    }
    return colors;
}

const colorSlice = createSlice({
    name: 'colors',
    initialState,
    reducers: {
        setTechColors(state, action: PayloadAction<TechColors>) {
            state.techColors = action.payload;
        },
        clearColors(state) {
            state.techColors = {};
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            githubApi.endpoints.getEnrichedUserRepos.matchFulfilled,
            (state, action) => {
                state.techColors = buildTechColors(action.payload);
            }
        );
    },
});

export const { setTechColors, clearColors } = colorSlice.actions;
export default colorSlice.reducer;
