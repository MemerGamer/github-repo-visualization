import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { commitSearch, setLayout } from '../../store/uiSlice';
import { selectCommittedUsername, selectLayout } from '../../store/selectors';
import { useGetEnrichedUserReposQuery } from '../../store/githubApi';
import MainLayout from '../templates/MainLayout';
import SearchBar from '../organisms/SearchBar';
import GraphVisualization from '../organisms/GraphVisualization';
import LanguageList from '../organisms/LanguageList';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { usernameParam, layoutParam } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const committedUsername = useSelector(selectCommittedUsername);
    const layout = useSelector(selectLayout);

    // Bootstrap from URL params on mount
    useEffect(() => {
        if (usernameParam) dispatch(commitSearch(usernameParam));
        if (layoutParam) dispatch(setLayout(layoutParam));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Keep URL in sync with store
    useEffect(() => {
        if (committedUsername) {
            navigate(`/${committedUsername}/${layout}`);
        }
    }, [committedUsername, layout, navigate]);

    const { isFetching, isError } = useGetEnrichedUserReposQuery(
        committedUsername,
        { skip: !committedUsername }
    );

    return (
        <MainLayout
            isLoading={isFetching}
            errorMessage={isError ? 'Error fetching repositories or technologies.' : null}
            searchBar={<SearchBar />}
        >
            <GraphVisualization />
            <LanguageList />
        </MainLayout>
    );
};

export default HomePage;
