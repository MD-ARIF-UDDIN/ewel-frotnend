import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Calendar, Plus, Clock, TrendingUp, Activity, Heart, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getProfileImageUrl, getInitials } from '../../utils/profileImage';
import api from '../../api/axios';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings');
            const bookingsData = response.data.data;

            setBookings(bookingsData);

            const stats = {
                totalBookings: bookingsData.length,
                pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
                confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
                completedBookings: bookingsData.filter(b => b.status === 'completed').length,
            };

            setStats(stats);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            title: 'Book a Test',
            description: 'Schedule your next medical test',
            icon: Plus,
            color: 'from-blue-500 to-blue-600',
            action: () => window.location.href = '/healthcare'
        },
        {
            title: 'View Bookings',
            description: 'Check your appointment history',
            icon: Calendar,
            color: 'from-blue-600 to-indigo-600',
            action: () => window.location.href = '/dashboard/user/bookings'
        },
        {
            title: 'Notifications',
            description: 'Stay updated with your health',
            icon: Bell,
            color: 'from-indigo-500 to-blue-600',
            action: () => window.location.href = '/dashboard/user/notifications'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-slate-300 font-medium">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
            <Sidebar />

            <div className="flex-1 lg:ml-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center space-x-4 mb-6">
                            <Avatar className="h-12 w-12">
                                {user?.profilePhoto && (
                                    <AvatarImage
                                        src={getProfileImageUrl(user.profilePhoto)}
                                        alt={user.name}
                                    />
                                )}
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    {user?.profilePhoto ? getInitials(user.name) : <Heart className="h-6 w-6" />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 font-poppins">My Healthcare Dashboard</h1>
                                <p className="text-lg text-gray-600 dark:text-slate-300 mt-1">Manage your health appointments and stay on top of your wellness journey</p>
                                <Badge variant="success" className="mt-2">
                                    Welcome Back!
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <Card className="hover:scale-105 transition-all duration-300 border-0 shadow-modern">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-300">Total Bookings</CardTitle>
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 font-poppins">{stats.totalBookings}</div>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">All time appointments</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:scale-105 transition-all duration-300 border-0 shadow-modern">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</CardTitle>
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-poppins">{stats.pendingBookings}</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting confirmation</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:scale-105 transition-all duration-300 border-0 shadow-modern">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Confirmed</CardTitle>
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-lg">
                                    <Activity className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600 font-poppins">{stats.confirmedBookings}</div>
                                <p className="text-xs text-gray-500 mt-1">Ready for appointment</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:scale-105 transition-all duration-300 border-0 shadow-modern">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-lg">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-700 font-poppins">{stats.completedBookings}</div>
                                <p className="text-xs text-gray-500 mt-1">Tests completed</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Card
                                    key={index}
                                    className="cursor-pointer hover:scale-105 transition-all duration-300 border-0 shadow-modern group overflow-hidden"
                                    onClick={action.action}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{action.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Main Content */}
                    <Card className="border-0 shadow-modern">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-lg">
                                    <Heart className="h-5 w-5 text-blue-600" />
                                </div>
                                <span>Welcome to Your Healthcare Hub</span>
                            </CardTitle>
                            <CardDescription>Your personalized healthcare management center</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-full w-fit">
                                        <Calendar className="h-12 w-12 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 font-poppins">Ready to start your health journey?</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Book your first healthcare test and take control of your wellness today.</p>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                                        onClick={() => window.location.href = '/healthcare'}
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Book Your First Test
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2 bg-blue-600 rounded-lg">
                                                <Calendar className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-blue-900">My Bookings</h3>
                                        </div>
                                        <p className="text-sm text-blue-700 mb-4">View and manage your appointments</p>
                                        <Button
                                            variant="outline"
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                                            onClick={() => window.location.href = '/dashboard/user/bookings'}
                                        >
                                            View Bookings
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="p-2 bg-indigo-600 rounded-lg">
                                                <Bell className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-indigo-900">Notifications</h3>
                                        </div>
                                        <p className="text-sm text-indigo-700 mb-4">Stay updated with your healthcare</p>
                                        <Button
                                            variant="outline"
                                            className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                                            onClick={() => window.location.href = '/dashboard/user/notifications'}
                                        >
                                            View Updates
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;


