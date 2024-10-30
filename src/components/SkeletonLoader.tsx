const SkeletonLoader: React.FC = () => (
    <div className="flex w-full h-[85vh] p-6">
        <div className="flex-grow bg-gray-800 rounded-2xl animate-pulse mr-4">
            <div className="h-full"></div>
        </div>
        <div className="flex flex-col w-1/6 space-y-4">
            <div className="bg-gray-800 h-1/2 rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                </div>
            </div>
            <div className="bg-gray-800 h-1/2 rounded-xl p-4 animate-pulse mt-4">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

export default SkeletonLoader;