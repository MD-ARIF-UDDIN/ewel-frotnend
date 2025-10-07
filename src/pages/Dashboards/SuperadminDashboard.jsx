import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import StatsCard from '../../components/StatsCard';
import {
    Users,
    Building,
    FileText,
    Calendar,
    Crown,
    TrendingUp,
    Activity,
    CheckCircle,
    Clock
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const SuperadminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [hcs, setHcs] = useState([]);
    const [tests, setTests] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalHCS: 0,
        totalTests: 0,
        totalBookings: 0,
        activeUsers: 0,
        pendingBookings: 0,
        completedBookings: 0,
        revenue: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, hcsResponse, testsResponse, bookingsResponse] = await Promise.all([
                api.get('/users'),
                api.get('/hcs'),
                api.get('/tests'),
                api.get('/bookings'),
            ]);

            setUsers(usersResponse.data.data);
            setHcs(hcsResponse.data.data);
            setTests(testsResponse.data.data);
            setBookings(bookingsResponse.data.data);

            const usersData = usersResponse.data.data;
            const bookingsData = bookingsResponse.data.data;
            const stats = {
                totalUsers: usersData.length,
                totalHCS: hcsResponse.data.data.length,
                totalTests: testsResponse.data.data.length,
                totalBookings: bookingsData.length,
                activeUsers: usersData.filter(u => u.role === 'Customer').length,
                pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
                completedBookings: bookingsData.filter(b => b.status === 'completed').length,
                revenue: bookingsData.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.test?.price || 0), 0),
            };

            setStats(stats);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const renderOverview = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    trend="up"
                    trendValue="+12%"
                />
                <StatsCard
                    title="Healthcare Centers"
                    value={stats.totalHCS}
                    icon={Building}
                    trend="up"
                    trendValue="+5%"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={Calendar}
                    trend="up"
                    trendValue="+18%"
                />
                <StatsCard
                    title="Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="+25%"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Active Users"
                    value={stats.activeUsers}
                    icon={Activity}
                    className="bg-green-50"
                />
                <StatsCard
                    title="Pending Bookings"
                    value={stats.pendingBookings}
                    icon={Clock}
                    className="bg-blue-50"
                />
                <StatsCard
                    title="Completed Bookings"
                    value={stats.completedBookings}
                    icon={CheckCircle}
                    className="bg-blue-50"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                            <div key={booking._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {booking.user?.name || 'Unknown User'} booked {booking.test?.title || 'Unknown Test'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(booking.createdAt)}
                                    </p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">
                                    {booking.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            <Sidebar />

            <div className="flex-1 lg:ml-64">
                <div className="p-6">

                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                                <Crown className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Superadmin Dashboard</h1>
                        </div>
                        <p className="text-gray-600 dark:text-slate-300">Complete system management and oversight</p>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Users"
                                value={stats.totalUsers}
                                icon={Users}
                                trend="up"
                                trendValue="+12%"
                            />
                            <StatsCard
                                title="Healthcare Centers"
                                value={stats.totalHCS}
                                icon={Building}
                                trend="up"
                                trendValue="+5%"
                            />
                            <StatsCard
                                title="Total Bookings"
                                value={stats.totalBookings}
                                icon={Calendar}
                                trend="up"
                                trendValue="+18%"
                            />
                            <StatsCard
                                title="Revenue"
                                value={`$${stats.revenue.toLocaleString()}`}
                                icon={TrendingUp}
                                trend="up"
                                trendValue="+25%"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatsCard
                                title="Active Users"
                                value={stats.activeUsers}
                                icon={Activity}
                                className="bg-green-50"
                            />
                            <StatsCard
                                title="Pending Bookings"
                                value={stats.pendingBookings}
                                icon={Clock}
                                className="bg-blue-50 dark:bg-blue-900/30"
                            />
                            <StatsCard
                                title="Completed Bookings"
                                value={stats.completedBookings}
                                icon={CheckCircle}
                                className="bg-blue-50 dark:bg-blue-900/30"
                            />
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest system activities and updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {bookings.slice(0, 5).map((booking) => (
                                        <div key={booking._id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {booking.user?.name || 'Unknown User'} booked {booking.test?.title || 'Unknown Test'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(booking.createdAt)}
                                                </p>
                                            </div>
                                            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                                                {booking.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperadminDashboard;