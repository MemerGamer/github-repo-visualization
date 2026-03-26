import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';
import { setInputUsername, commitSearch, setLayout } from '../../store/uiSlice';
import { selectInputUsername, selectCommittedUsername, selectLayout } from '../../store/selectors';
import SearchInput from '../molecules/SearchInput';
import LayoutSelector from '../molecules/LayoutSelector';

const SearchBar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const inputUsername = useSelector(selectInputUsername);
    const committedUsername = useSelector(selectCommittedUsername);
    const layout = useSelector(selectLayout);

    const handleSearch = () => {
        if (inputUsername && inputUsername !== committedUsername) {
            dispatch(commitSearch(inputUsername));
        }
    };

    const handleLayoutChange = (value: string) => {
        dispatch(setLayout(value));
        if (committedUsername) {
            navigate(`/${committedUsername}/${value}`);
        }
    };

    return (
        <div className="flex justify-center w-full max-w-2xl mb-4 gap-4 flex-wrap">
            <SearchInput
                value={inputUsername}
                onChange={(val) => dispatch(setInputUsername(val))}
                onSearch={handleSearch}
            />
            <LayoutSelector value={layout} onChange={handleLayoutChange} />
        </div>
    );
};

export default SearchBar;
