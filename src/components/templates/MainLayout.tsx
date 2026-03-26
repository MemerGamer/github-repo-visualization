import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import ErrorMessage from '../atoms/ErrorMessage';

interface MainLayoutProps {
    isLoading: boolean;
    errorMessage: string | null;
    searchBar: React.ReactNode;
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isLoading, errorMessage, searchBar, children }) => (
    <div className="flex flex-col items-center p-6 h-screen w-screen bg-gray-900 transition-colors duration-300">
        {searchBar}
        <ErrorMessage message={errorMessage} />
        {isLoading ? (
            <SkeletonLoader />
        ) : (
            <div className="flex w-full h-[85vh]">
                {children}
            </div>
        )}
    </div>
);

export default MainLayout;
