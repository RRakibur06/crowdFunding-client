'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '../../../context/AuthContext';
import { ProjectContext } from '../../../context/ProjectContext';
import ProjectCard from '../../../components/projects/ProjectCard';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import axios from 'axios';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const { projects, getProjects } = useContext(ProjectContext);
    const [userProjects, setUserProjects] = useState([]);
    const [userDonations, setUserDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get user's projects
                await getProjects();

                // Get user's donations
                const donationsRes = await axios.get('/api/donations/user');
                setUserDonations(donationsRes.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // Filter projects created by the user
        if (projects && user) {
            const filtered = projects.filter(project => project.creator === user.id);
            setUserProjects(filtered);
        }
    }, [projects, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary-500 mb-2">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-secondary-500">Manage your projects and track your contributions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-secondary-500 mb-2">My Projects</h3>
                        <p className="text-3xl font-bold text-primary-600">{userProjects.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-secondary-500 mb-2">Projects Backed</h3>
                        <p className="text-3xl font-bold text-primary-600">{userDonations.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-secondary-500 mb-2">Total Contributed</h3>
                        <p className="text-3xl font-bold text-primary-600">
                            ${userDonations.reduce((total, donation) => total + donation.amount, 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* My Projects Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-secondary-500">My Projects</h2>
                        <Link href="/projects/create" className="btn bg-red-500 px-2 py-1">
                            Create New Project
                        </Link>
                    </div>

                    {userProjects.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-secondary-900 mb-4">You haven't created any projects yet.</p>
                            <Link href="/projects/create" className="btn bg-red-500 px-2 py-1">
                                Start Your First Project
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userProjects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Backed Projects Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-secondary-500 mb-6">Projects I've Backed</h2>

                    {userDonations.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-secondary-900 mb-4">You haven't backed any projects yet.</p>
                            <Link href="/" className="btn bg-red-500">
                                Discover Projects
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-secondary-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {userDonations.map((donation, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-secondary-900">
                                                    {donation.project?.title || 'Unknown Project'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-secondary-900">${donation.amount}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                                                {new Date(donation.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}