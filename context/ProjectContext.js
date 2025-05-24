'use client';

import { createContext, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const ProjectContext = createContext();

const initialState = {
    projects: [],
    project: null,
    loading: true,
    error: null
};

const projectReducer = (state, action) => {
    switch (action.type) {
        case 'GET_PROJECTS':
            return {
                ...state,
                projects: action.payload,
                loading: false
            };
        case 'GET_PROJECT':
            return {
                ...state,
                project: action.payload,
                loading: false
            };
        case 'CREATE_PROJECT':
            return {
                ...state,
                projects: [action.payload, ...state.projects],
                loading: false
            };
        case 'ADD_DONATION':
            return {
                ...state,
                project: action.payload.project,
                loading: false
            };
        case 'PROJECT_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case 'CLEAR_PROJECT':
            return {
                ...state,
                project: null
            };
        default:
            return state;
    }
};

export const ProjectProvider = ({ children }) => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    const router = useRouter();

    // Get all projects
    const getProjects = async () => {
        try {
            const res = await axios.get('/api/projects');
            dispatch({ type: 'GET_PROJECTS', payload: res.data });
        } catch (err) {
            dispatch({
                type: 'PROJECT_ERROR',
                payload: err.response?.data?.message || 'Error fetching projects'
            });
        }
    };

    // Get single project
    const getProject = async id => {
        try {
            const res = await axios.get(`/api/projects/${id}`);
            dispatch({ type: 'GET_PROJECT', payload: res.data });
        } catch (err) {
            dispatch({
                type: 'PROJECT_ERROR',
                payload: err.response?.data?.message || 'Error fetching project'
            });
        }
    };

    // Create project
    const createProject = async formData => {
        try {
            const res = await axios.post('/api/projects', formData);
            dispatch({ type: 'CREATE_PROJECT', payload: res.data });
            router.push(`/projects/${res.data._id}`);
            return res.data;
        } catch (err) {
            dispatch({
                type: 'PROJECT_ERROR',
                payload: err.response?.data?.message || 'Error creating project'
            });
            throw err;
        }
    };

    // Add donation
    const addDonation = async (projectId, amount) => {
        try {
            const res = await axios.post('/api/donations', { projectId, amount });
            dispatch({ type: 'ADD_DONATION', payload: res.data });
        } catch (err) {
            dispatch({
                type: 'PROJECT_ERROR',
                payload: err.response?.data?.message || 'Error processing donation'
            });
            throw err;
        }
    };

    // Clear current project
    const clearProject = () => {
        dispatch({ type: 'CLEAR_PROJECT' });
    };

    return (
        <ProjectContext.Provider
            value={{
                projects: state.projects,
                project: state.project,
                loading: state.loading,
                error: state.error,
                getProjects,
                getProject,
                createProject,
                addDonation,
                clearProject
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};