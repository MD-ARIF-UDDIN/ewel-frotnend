import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    token,
                    user: JSON.parse(user),
                },
            });
            // Refresh user data to get updated profile info including photo
            refreshUserData(token);
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const refreshUserData = async (token) => {
        try {
            const response = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token, user: userData },
            });
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            // If refreshing fails, we might want to log the user out
            // dispatch({ type: 'LOGOUT' });
        }
    };

    const login = async (email, password) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await api.post('/auth/login', { email, password });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token, user },
            });

            return { success: true, user, token };
        } catch (error) {
            dispatch({ type: 'LOGIN_FAIL' });
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (userData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Set appropriate headers for FormData
            const config = {};
            if (userData instanceof FormData) {
                config.headers = {
                    'Content-Type': 'multipart/form-data'
                };
            }

            const response = await api.post('/auth/register', userData, config);

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token, user },
            });

            return { success: true };
        } catch (error) {
            dispatch({ type: 'LOGIN_FAIL' });
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    const forgotPassword = async (email) => {
        try {
            await api.post('/auth/forgot-password', { email });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send reset email',
            };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await api.put(`/auth/reset-password/${token}`, { password });

            const { token: newToken, user } = response.data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token: newToken, user },
            });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password reset failed',
            };
        }
    };

    const updateUserProfile = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token: state.token, user: updatedUser },
        });
        // Also refresh the user data from the server to ensure consistency
        if (state.token) {
            refreshUserData(state.token);
        }
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUserProfile,
        refreshUserData
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


