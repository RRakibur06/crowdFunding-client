'use client';

import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';

export default function Register() {
    const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const [formError, setFormError] = useState('');

    const { name, email, password, password2 } = formData;

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }

        if (error) {
            setFormError(error);
            clearError();
        }
        // eslint-disable-next-line
    }, [isAuthenticated, error]);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            setFormError('Passwords do not match');
        } else {
            register({ name, email, password });
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 px-4">
            <h1 className="text-3xl font-bold text-center text-secondary-800 mb-6">Register</h1>

            {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {formError}
                </div>
            )}

            <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-6 text-secondary-900">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                        minLength="6"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password2" className="block text-sm font-medium text-secondary-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={password2}
                        onChange={onChange}
                        className="input border border-secondary-400 focus:border-secondary-600 w-full p-2 rounded-md"
                        minLength="6"
                        required
                    />
                </div>

                <button type="submit" className="w-full btn bg-red-500 py-2 text-lg">
                    Register
                </button>
            </form>

            <p className="text-center mt-4 text-secondary-400">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}