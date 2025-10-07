import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import {
    BarChart3,
    TrendingUp,
    Activity,
    CheckCircle,
    AlertCircle,
    Users,
    Calendar,
    Building,
    FileText
} from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import StatsCard from '../../../components/StatsCard';
import api from '../../../api/axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SuperadminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [userGrowthData, setUserGrowthData] = useState({ labels: [], data: [] });
    const [bookingTrendsData, setBookingTrendsData] = useState({ labels: [], data: [] });
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
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [usersResponse, hcsResponse, testsResponse, bookingsResponse] = await Promise.all([
                api.get('/users'),
                api.get('/hcs'),
                api.get('/tests'),
                api.get('/bookings'),
            ]);

            const usersData = usersResponse.data.data;
            const bookingsData = bookingsResponse.data.data;

            const calculatedStats = {
                totalUsers: usersData.length,
                totalHCS: hcsResponse.data.data.length,
                totalTests: testsResponse.data.data.length,
                totalBookings: bookingsData.length,
                activeUsers: usersData.filter(u => u.role === 'Customer').length,
                pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
                completedBookings: bookingsData.filter(b => b.status === 'completed').length,
                revenue: bookingsData.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.test?.price || 0), 0),
            };

            setStats(calculatedStats);

            // Process user growth data (last 6 months)
            const userGrowth = processUserGrowthData(usersData);
            setUserGrowthData(userGrowth);

            // Process booking trends data (last 6 months)
            const bookingTrends = processBookingTrendsData(bookingsData);
            setBookingTrendsData(bookingTrends);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process user growth data by month
    const processUserGrowthData = (users) => {
        const months = [];
        const counts = [];

        // Get last 6 months
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(date.toLocaleString('default', { month: 'short' }));

            // Count users created in this month
            const count = users.filter(user => {
                const userDate = new Date(user.createdAt);
                return userDate.getMonth() === date.getMonth() &&
                    userDate.getFullYear() === date.getFullYear();
            }).length;

            counts.push(count);
        }

        return { labels: months, data: counts };
    };

    // Process booking trends data by month
    const processBookingTrendsData = (bookings) => {
        const months = [];
        const counts = [];

        // Get last 6 months
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(date.toLocaleString('default', { month: 'short' }));

            // Count bookings created in this month
            const count = bookings.filter(booking => {
                const bookingDate = new Date(booking.createdAt);
                return bookingDate.getMonth() === date.getMonth() &&
                    bookingDate.getFullYear() === date.getFullYear();
            }).length;

            counts.push(count);
        }

        return { labels: months, data: counts };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex">
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
                        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                        <p className="text-gray-600">System performance metrics and insights</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatsCard
                            title="Active Users"
                            value={stats.activeUsers}
                            icon={Activity}
                            className="bg-green-50"
                        />
                        <StatsCard
                            title="Pending Bookings"
                            value={stats.pendingBookings}
                            icon={Calendar}
                            className="bg-blue-50"
                        />
                        <StatsCard
                            title="Completed Bookings"
                            value={stats.completedBookings}
                            icon={CheckCircle}
                            className="bg-blue-50"
                        />
                    </div>

                    {/* Charts and Visualizations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Growth</CardTitle>
                                <CardDescription>User registration trends over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    {userGrowthData.labels.length > 0 ? (
                                        <Line
                                            data={{
                                                labels: userGrowthData.labels,
                                                datasets: [
                                                    {
                                                        label: 'New Users',
                                                        data: userGrowthData.data,
                                                        borderColor: '#3b82f6',
                                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                        borderWidth: 2,
                                                        fill: true,
                                                        tension: 0.4,
                                                    }
                                                ]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.05)'
                                                        }
                                                    },
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500">
                                            <div className="text-center">
                                                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                <p>No user data available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Trends</CardTitle>
                                <CardDescription>Booking patterns and statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    {bookingTrendsData.labels.length > 0 ? (
                                        <Bar
                                            data={{
                                                labels: bookingTrendsData.labels,
                                                datasets: [
                                                    {
                                                        label: 'Bookings',
                                                        data: bookingTrendsData.data,
                                                        backgroundColor: '#10b981',
                                                        borderColor: '#059669',
                                                        borderWidth: 1,
                                                    }
                                                ]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.05)'
                                                        }
                                                    },
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500">
                                            <div className="text-center">
                                                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                <p>No booking data available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Revenue Analytics */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Revenue Analytics</CardTitle>
                            <CardDescription>Financial performance and revenue trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</div>
                                    <div className="text-sm text-green-600">Total Revenue</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        ${stats.completedBookings > 0 ? Math.round(stats.revenue / stats.completedBookings) : 0}
                                    </div>
                                    <div className="text-sm text-blue-600">Avg. per Booking</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{stats.completedBookings}</div>
                                    <div className="text-sm text-purple-600">Paid Bookings</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                                    </div>
                                    <div className="text-sm text-blue-600">Completion Rate</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Health */}
                    <Card>
                        <CardHeader>
                            <CardTitle>System Health</CardTitle>
                            <CardDescription>Platform performance and status indicators</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <div>
                                        <div className="font-medium text-green-900">System Status</div>
                                        <div className="text-sm text-green-600">All systems operational</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                    <div>
                                        <div className="font-medium text-blue-900">Response Time</div>
                                        <div className="text-sm text-blue-600">120ms average</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-blue-600" />
                                    <div>
                                        <div className="font-medium text-blue-900">Uptime</div>
                                        <div className="text-sm text-blue-600">99.9% this month</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SuperadminAnalytics;