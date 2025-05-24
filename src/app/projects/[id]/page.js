'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AuthContext } from '../../../../context/AuthContext';
import { ProjectContext } from '../../../../context/ProjectContext';
import DonationButton from '../../../../components/DonationButton';

export default function ProjectDetails() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { project, loading, getProject, addDonation, clearProject } = useContext(ProjectContext);
    const { isAuthenticated, user } = useContext(AuthContext);

    const [donationAmount, setDonationAmount] = useState('');
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [donationError, setDonationError] = useState('');
    const [donationLoading, setDonationLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`;

    useEffect(() => {
        if (id) {
            getProject(id);
        }
        return () => clearProject();
    }, [id]);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDonation = async e => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        setDonationLoading(true);
        setDonationError('');

        try {
            await addDonation(id, parseFloat(donationAmount));
            setDonationAmount('');
            setShowDonationForm(false);
            alert('Thank you for your donation!');
        } catch (err) {
            setDonationError('Failed to process donation. Please try again.');
        } finally {
            setDonationLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-secondary-800">Project not found</h1>
            </div>
        );
    }

    const progressPercentage = (project.currentAmount / project.goalAmount) * 100;
    const daysLeft = Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden">
                        <Image
                            src={project.imageUrl || '/api/placeholder/800/400'}
                            alt={project.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <h1 className="text-4xl font-bold text-secondary-400 mb-4">
                        {project.title}
                    </h1>

                    <p className="text-lg text-secondary-400 mb-6 leading-relaxed">
                        {project.description}
                    </p>

                    {/* Project Updates */}
                    {project.updates && project.updates.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-2xl font-bold text-secondary-800 mb-4">Project Updates</h3>
                            {project.updates.map((update, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                                    <p className="text-secondary-900 mb-2">{update.content}</p>
                                    <small className="text-secondary-400">
                                        {new Date(update.date).toLocaleDateString()}
                                    </small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                        {/* Project Stats */}
                        <div className="mb-6">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                ${project.currentAmount.toLocaleString()}
                            </div>
                            <div className="text-secondary-900">
                                of ${project.goalAmount.toLocaleString()} goal
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-primary-600 h-3 rounded-full"
                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm text-secondary-500 mt-2">
                                <span>{Math.round(progressPercentage)}% funded</span>
                                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended'}</span>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="mb-6 space-y-2 text-sm text-secondary-900">
                            <div>{project.backers?.length || 0} backers</div>
                            <div>Created by {project.creator?.name}</div>
                            <div>End date: {new Date(project.endDate).toLocaleDateString()}</div>
                        </div>

                        {/* Share Section */}
                        <div className="border-t pt-4 mb-6">
                            <h4 className="font-semibold text-secondary-800 mb-3">Share Project</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-secondary-400 rounded-lg text-sm bg-gray-50 text-secondary-900"
                                    />
                                    <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
                                        <button className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                                            {copied ? 'Copied!' : 'Copy'}
                                        </button>
                                    </CopyToClipboard>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=Check out this project: ${project.title}&url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-opacity-90 text-center text-sm"
                                    >
                                        Share on Twitter
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 px-3 py-2 bg-[#4267B2] text-white rounded-lg hover:bg-opacity-90 text-center text-sm"
                                    >
                                        Share on Facebook
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Donation Form */}
                        {daysLeft > 0 && (
                            <>
                                {!showDonationForm ? (
                                    <button
                                        onClick={() => setShowDonationForm(true)}
                                        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-lg mb-4"
                                    >
                                        Back This Project
                                    </button>
                                ) : (
                                    <form onSubmit={handleDonation} className="mb-4">
                                        {donationError && (
                                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                                                {donationError}
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                                Donation Amount ($)
                                            </label>
                                            <input
                                                type="number"
                                                value={donationAmount}
                                                onChange={(e) => setDonationAmount(e.target.value)}
                                                className="w-full px-3 py-2 border border-secondary-400 text-sm bg-gray-50 text-secondary-900 rounded-lg"
                                                placeholder="25"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                disabled={donationLoading}
                                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                            >
                                                {donationLoading ? 'Processing...' :
                                                    <DonationButton
                                                        projectId={id}
                                                        projectName={project.title}
                                                        amount={donationAmount}
                                                    />
                                                }
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowDonationForm(false);
                                                    setDonationAmount('');
                                                    setDonationError('');
                                                }}
                                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}

                        {/* Backers List */}
                        {project.backers && project.backers.length > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-secondary-800 mb-3">Recent Backers</h4>
                                <div className="space-y-2">
                                    {project.backers.slice(0, 5).map((backer, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-secondary-900">{backer.user?.name || 'Anonymous'}</span>
                                            <span className="font-medium">${backer.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}