'use client';

import { createContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const AuthContext = createContext();

const getInitialState = () => {
    if (typeof window !== 'undefined') {
        const authState = localStorage.getItem('auth-state');
        if (authState) {
            const parsedState = JSON.parse(authState);
            if (parsedState.state.authToken) {
                return {
                    user: null,
                    token: parsedState.state.authToken,
                    isAuthenticated: true,
                    loading: true,
                    error: null
                };
            }
        }
    }
    return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        error: null
    };
};

const initialState = getInitialState();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
                error: null
            };
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                user: action.payload.user,
                error: null
            };
        case 'AUTH_ERROR':
        case 'REGISTER_FAIL':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const router = useRouter();

    // Set auth token
    const setAuthToken = token => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            // Store the full auth state
            localStorage.setItem('auth-state', JSON.stringify({
                state: {
                    isLoggedIn: true,
                    authToken: token
                },
                version: 0
            }));
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            localStorage.removeItem('auth-state');
        }
    };

    // Load user
    const loadUser = async () => {
        // Check both token sources
        const token = localStorage.getItem('token');
        const authState = localStorage.getItem('auth-state');
        let authToken = token;

        if (!authToken && authState) {
            const parsedState = JSON.parse(authState);
            authToken = parsedState.state.authToken;
        }

        if (authToken) {
            setAuthToken(authToken);
            try {
                const res = await axios.get('/api/users/single-user');
                dispatch({ type: 'USER_LOADED', payload: res.data });
            } catch (err) {
                setAuthToken(null);
                dispatch({ type: 'AUTH_ERROR' });
            }
        } else {
            setAuthToken(null);
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    // Register user
    const register = async formData => {
        try {
            const res = await axios.post('/api/users/register', formData);
            setAuthToken(res.data.token);
            dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
            // await loadUser();
            router.push('/');
        } catch (err) {
            setAuthToken(null);
            dispatch({
                type: 'REGISTER_FAIL',
                payload: err.response?.data?.message || 'Registration failed'
            });
        }
    };

    // Login user
    const login = async formData => {
        try {
            const res = await axios.post('/api/users/login', formData);
            setAuthToken(res.data.token);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            await loadUser();
            router.push('/');
        } catch (err) {
            setAuthToken(null);
            dispatch({
                type: 'LOGIN_FAIL',
                payload: err.response?.data?.message || 'Login failed'
            });
        }
    };

    // Logout
    const logout = () => {
        setAuthToken(null);
        dispatch({ type: 'LOGOUT' });
        router.push('/');
    };

    // Clear errors
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authState = localStorage.getItem('auth-state');
            if (authState) {
                const parsedState = JSON.parse(authState);
                if (parsedState.state.authToken) {
                    setAuthToken(parsedState.state.authToken);
                }
            }
            loadUser();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                login,
                logout,
                clearError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};