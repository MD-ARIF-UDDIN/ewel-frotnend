import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
    Bell,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    Settings,
    Check,
    Trash2
} from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import { useNotifications } from '../../../hooks/useNotifications';
import api from '../../../api/axios';

const UserNotifications = () => {
    const { notifications, loading, refetch } = useNotifications();
    const [localNotifications, setLocalNotifications] = useState([]);

    useEffect(() => {
        // Add icons to notifications from the hook
        const notificationsWithIcons = notifications.map(notification => {
            let icon;
            switch (notification.type) {
                case 'success':
                    icon = CheckCircle;
                    break;
                case 'warning':
                    icon = Clock;
                    break;
                case 'error':
                    icon = AlertCircle;
                    break;
                case 'info':
                default:
                    icon = notification.title.includes('Tomorrow') || notification.title.includes('Confirmed') ? Calendar : Bell;
                    break;
            }
            return { ...notification, icon };
        });
        setLocalNotifications(notificationsWithIcons);
    }, [notifications]);

    const markAsRead = async (notificationId) => {
        try {
            // Update local state immediately for better UX
            setLocalNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId
                        ? { ...notif, read: true }
                        : notif
                )
            );

            // Send request to backend
            await api.put(`/notifications/${notificationId}/read`);

            // Refresh notifications from backend
            await refetch();
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Revert the change if API call fails
            setLocalNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId
                        ? { ...notif, read: false }
                        : notif
                )
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            // Update local state immediately
            const previousState = [...localNotifications];
            setLocalNotifications(prev =>
                prev.map(notif => ({ ...notif, read: true }))
            );

            // Send request to backend
            await api.put('/notifications/mark-all-read');

            // Refresh notifications from backend
            await refetch();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            // Revert changes if API call fails
            setLocalNotifications(previousState);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            // Store the notification for potential rollback
            const notificationToDelete = localNotifications.find(n => n._id === notificationId);

            // Update local state immediately
            setLocalNotifications(prev =>
                prev.filter(notif => notif._id !== notificationId)
            );

            // TODO: In a real app, you would also send this to the backend
            // await api.delete(`/notifications/${notificationId}`);
        } catch (error) {
            console.error('Error deleting notification:', error);
            // Revert the change if API call fails
            if (notificationToDelete) {
                setLocalNotifications(prev => [...prev, notificationToDelete].sort(
                    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                ));
            }
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const diffInMs = now - new Date(date);
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            return `${diffInDays} days ago`;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success':
                return 'text-green-600 bg-green-100';
            case 'warning':
                return 'text-yellow-600 bg-yellow-100';
            case 'error':
                return 'text-red-600 bg-red-100';
            case 'info':
            default:
                return 'text-blue-600 bg-blue-100';
        }
    };

    const unreadCount = localNotifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Sidebar />

            <div className="flex-1 lg:ml-64">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Notifications</h1>
                                <p className="text-gray-600 dark:text-slate-300">Stay updated with your healthcare appointments and results</p>
                            </div>
                            <div className="flex space-x-3">
                                {unreadCount > 0 && (
                                    <Button variant="outline" onClick={markAllAsRead}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Mark All Read
                                    </Button>
                                )}
                                <Button variant="outline">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                                <Bell className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{localNotifications.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {localNotifications.filter(n => {
                                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                                        return new Date(n.timestamp) > weekAgo;
                                    }).length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notifications List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Notifications</CardTitle>
                            <CardDescription>Your latest healthcare updates and reminders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {localNotifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                                    <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {localNotifications.map((notification) => {
                                        const IconComponent = notification.icon;
                                        return (
                                            <div
                                                key={notification._id}
                                                className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${!notification.read
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'bg-white border-gray-200'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                                    <IconComponent className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            {notification.title}
                                                            {!notification.read && (
                                                                <Badge className="ml-2 bg-red-100 text-red-800">New</Badge>
                                                            )}
                                                        </h4>
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(notification.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-1">
                                                    {!notification.read && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => markAsRead(notification._id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteNotification(notification._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserNotifications;