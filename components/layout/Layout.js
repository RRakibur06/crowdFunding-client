'use client';

import { useContext } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const { loading } = useContext(AuthContext);

    return (
        <>
            <Head>
                <title>FundIt - Crowdfunding Platform</title>
                <meta name="description" content="Support creative projects and help bring them to life" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />
            <main>{!loading && children}</main>
            <footer className="bg-secondary-800 text-white p-6 mt-12">
                <div className="container mx-auto">
                    <div className="text-center">
                        <p className="mb-2">© 2025 FundIt - Crowdfunding Platform</p>
                        <p className="text-sm text-secondary-300">Support creative projects and help bring them to life</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Layout;