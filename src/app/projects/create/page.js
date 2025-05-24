'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../../context/AuthContext';
import { ProjectContext } from '../../../../context/ProjectContext';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';

export default function CreateProject() {
    const { user } = useContext(AuthContext);
    const { createProject } = useContext(ProjectContext);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalAmount: '',
        endDate: '',
        imageUrl: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { title, description, goalAmount, endDate, imageUrl } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createProject({
                title,
                description,
                goalAmount: parseFloat(goalAmount),
                endDate,
                imageUrl
            });
        } catch (err) {
            setError('Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="max-w-2xl mx-auto my-12 px-4">
                <h1 className="text-3xl font-bold text-center text-secondary-800 mb-8">
                    Start Your Project
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-8 text-secondary-900">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                            Project Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={onChange}
                            className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                            placeholder="Give your project a compelling title"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                            Project Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={onChange}
                            rows="6"
                            className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                            placeholder="Describe your project in detail..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="goalAmount" className="block text-sm font-medium text-secondary-700 mb-2">
                                Funding Goal ($) *
                            </label>
                            <input
                                type="number"
                                id="goalAmount"
                                name="goalAmount"
                                value={goalAmount}
                                onChange={onChange}
                                className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                                placeholder="5000"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-secondary-700 mb-2">
                                Campaign End Date *
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={endDate}
                                onChange={onChange}
                                className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-secondary-700 mb-2">
                            Project Image URL
                        </label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={imageUrl}
                            onChange={onChange}
                            className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-sm text-secondary-500 mt-1">
                            Add an image URL to make your project more appealing
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn bg-red-500 py-3 text-lg disabled:opacity-50"
                    >
                        {loading ? 'Creating Project...' : 'Create Project'}
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
}