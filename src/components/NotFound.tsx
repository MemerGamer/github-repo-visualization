import { Link } from "react-router-dom";
function NotFound() {
    return (
        <div className="space-y-4 dark:bg-gray-900 overflow-hidden">
            <div className="flex items-center justify-center w-screen h-screen dark:bg-gray-800">
                <div className="px-4 lg:py-12">
                    <div className="lg:gap-4 lg:flex">
                        <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
                            <h1 className="font-bold text-blue-600 text-9xl">404</h1>
                            <p className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl dark:text-white">
                                <span className="text-red-500">Oops!</span> Page Not Found
                            </p>
                            <p className="mb-8 text-center text-gray-500 md:text-lg dark:text-white">
                                The page you’re looking for doesn’t exist.
                            </p>
                            <Link
                                to="/"
                                className="px-5 py-2 rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700"
                            >
                                Go home
                            </Link>
                            <div className="mt-4">
                                <img
                                    src="https://cataas.com/cat/gif"
                                    alt="img"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default NotFound;