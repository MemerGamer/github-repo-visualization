import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    inputUsername: string;
    committedUsername: string;
    layout: string;
    hiddenLanguages: string[];
    hiddenForks: boolean;
}

const initialState: UIState = {
    inputUsername: '',
    committedUsername: '',
    layout: 'grid',
    hiddenLanguages: [],
    hiddenForks: true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setInputUsername(state, action: PayloadAction<string>) {
            state.inputUsername = action.payload;
        },
        commitSearch(state, action: PayloadAction<string>) {
            state.committedUsername = action.payload;
            state.inputUsername = action.payload;
        },
        setLayout(state, action: PayloadAction<string>) {
            state.layout = action.payload;
        },
        toggleLanguage(state, action: PayloadAction<string>) {
            const lang = action.payload;
            const idx = state.hiddenLanguages.indexOf(lang);
            if (idx === -1) {
                state.hiddenLanguages.push(lang);
            } else {
                state.hiddenLanguages.splice(idx, 1);
            }
        },
        toggleForks(state) {
            state.hiddenForks = !state.hiddenForks;
        },
    },
});

export const { setInputUsername, commitSearch, setLayout, toggleLanguage, toggleForks } = uiSlice.actions;
export default uiSlice.reducer;
