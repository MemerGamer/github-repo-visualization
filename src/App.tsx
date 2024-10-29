import React from 'react';
import GitHubUserSearch from './components/GitHubUserSearch';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <GitHubUserSearch />
    </div>
  );
};

export default App;
