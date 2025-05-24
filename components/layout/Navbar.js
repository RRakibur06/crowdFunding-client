'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <nav className="bg-white shadow-md"><div className="container mx-auto px-4"></div></nav>;
    }

    return (
        <nav className="bg-white shadow-md py-2 px-4">
            <div className="container mx-auto flex justify-between items-center py-4">
                <Link href="/" className="text-2xl font-bold text-primary-600">
                    FundIt
                </Link>

                {/* <Link
                    href="/"
                    className={`text-secondary-900 hover:text-primary-600 ${pathname === '/' ? 'font-semibold text-primary-600' : ''
                        }`}
                >
                    Discover
                </Link> */}

                {isAuthenticated ? (
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/projects/create"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Start a Project
                        </Link>
                        <Link
                            href="/dashboard"
                            className={`text-secondary-900 hover:text-primary-600 ${pathname === '/dashboard' ? 'font-semibold text-primary-600' : ''
                                }`}
                        >
                            Dashboard
                        </Link>
                        <div className="flex items-center space-x-4 mx-4">
                            <span className="text-secondary-900">Hi, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/login"
                            className="text-secondary-900 hover:text-primary-600"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;