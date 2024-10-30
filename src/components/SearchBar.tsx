const SearchBar: React.FC<{
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    layout: string;
    setLayout: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
    updateRoute: () => void;
}> = ({ username, setUsername, layout, setLayout, handleSearch, updateRoute }) => (
    <div className="flex justify-center w-full max-w-lg mb-4">
        <h1 className='text-white text-lg align-middle justify-center p-2'>GitHub Username:</h1>
        <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200"
        />
        <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
            Search
        </button>
        <h1 className='text-white text-lg align-middle justify-center p-2'>Graph Layout:</h1>
        <select
            title='layout-select'
            value={layout}
            onChange={(e) => {
                setLayout(e.target.value);
                updateRoute();
            }}
            className="ml-2 p-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200"
        >
            <option value="grid">Grid</option>
            <option value="cose">Cose</option>
            <option value="breadthfirst">Breadthfirst</option>
            <option value="concentric">Concentric</option>
            <option value="circle">Circle</option>
        </select>
    </div>
);

export default SearchBar;