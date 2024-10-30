import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GitHubUserSearch from './components/GitHubUserSearch';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:usernameParam?/:layoutParam?" element={<GitHubUserSearch />} />
      </Routes>
    </Router>
  );
};

export default App;