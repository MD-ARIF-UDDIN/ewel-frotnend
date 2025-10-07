import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            // Only fetch notifications for Customer users
            if (!user || user.role !== 'Customer') {
                setNotifications([]);
                setUnreadCount(0);
                return;
            }

            // Fetch notifications from backend API
            const response = await api.get('/notifications');
            const fetchedNotifications = response.data.data;

            setNotifications(fetchedNotifications);
            setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    return {
        notifications,
        unreadCount,
        loading,
        refetch: fetchNotifications
    };
};