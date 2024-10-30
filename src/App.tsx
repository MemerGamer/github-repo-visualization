import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GitHubUserSearch from './components/GitHubUserSearch';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:usernameParam?/:layoutParam?" element={<GitHubUserSearch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;