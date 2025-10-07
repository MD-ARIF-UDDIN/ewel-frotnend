import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
    BarChart3,
    TrendingUp,
    Calendar,
    Users,
    FileText,
    Download,
    Activity,
    Clock,
    CheckCircle,
    DollarSign
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

const HCSReports = () => {
    const [loading, setLoading] = useState(true);
    const [bookingTrendsData, setBookingTrendsData] = useState({ labels: [], data: [] });
    const [bookings, setBookings] = useState([]);
    const [tests, setTests] = useState([]);
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        totalTests: 0,
        revenue: 0,
    });

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const [bookingsResponse, testsResponse] = await Promise.all([
                api.get('/bookings'),
                api.get('/tests'),
            ]);

            const bookingsData = bookingsResponse.data.data;
            const testsData = testsResponse.data.data;

            setBookings(bookingsData);
            setTests(testsData);

            const calculatedStats = {
                totalBookings: bookingsData.length,
                pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
                confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
                completedBookings: bookingsData.filter(b => b.status === 'completed').length,
                totalTests: testsData.length,
                revenue: bookingsData.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.test?.price || 0), 0),
            };

            setStats(calculatedStats);

            // Process booking trends data (last 6 months)
            const bookingTrends = processBookingTrendsData(bookingsData);
            setBookingTrendsData(bookingTrends);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
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
            <div className="min-h-screen flex bg-white dark:bg-slate-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-900">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
                <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Reports & Analytics</h1>
                                <p className="text-gray-600 dark:text-slate-300">Performance insights and business analytics</p>
                            </div>
                            <Button>
                                <Download className="h-4 w-4 mr-2" />
                                Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Bookings"
                            value={stats.totalBookings}
                            icon={Calendar}
                            trend="up"
                            trendValue="+12%"
                        />
                        <StatsCard
                            title="Completed Tests"
                            value={stats.completedBookings}
                            icon={CheckCircle}
                            trend="up"
                            trendValue="+8%"
                        />
                        <StatsCard
                            title="Available Tests"
                            value={stats.totalTests}
                            icon={FileText}
                            trend="up"
                            trendValue="+3%"
                        />
                        <StatsCard
                            title="Revenue"
                            value={`$${stats.revenue.toLocaleString()}`}
                            icon={DollarSign}
                            trend="up"
                            trendValue="+15%"
                        />
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    Booking Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-slate-400">Pending</span>
                                        <span className="font-medium text-blue-600 dark:text-blue-400">{stats.pendingBookings}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-slate-400">Confirmed</span>
                                        <span className="font-medium text-blue-600 dark:text-blue-400">{stats.confirmedBookings}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-slate-400">Completed</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">{stats.completedBookings}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                                    Completion Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                                        {stats.completedBookings} of {stats.totalBookings} bookings completed
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <DollarSign className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                                    Average Revenue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                        ${stats.completedBookings > 0 ? Math.round(stats.revenue / stats.completedBookings) : 0}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Per completed booking</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Trends</CardTitle>
                                <CardDescription>Monthly booking patterns</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    {bookingTrendsData.labels.length > 0 ? (
                                        <Line
                                            data={{
                                                labels: bookingTrendsData.labels,
                                                datasets: [
                                                    {
                                                        label: 'Bookings',
                                                        data: bookingTrendsData.data,
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
                                        <div className="h-full flex items-center justify-center text-gray-500 dark:text-slate-400">
                                            <div className="text-center">
                                                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-slate-500" />
                                                <p>No booking data available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Analytics</CardTitle>
                                <CardDescription>Revenue performance over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <div className="h-full flex items-center justify-center text-gray-500 dark:text-slate-400">
                                        <div className="text-center">
                                            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-slate-500" />
                                            <p>Revenue analytics chart would be displayed here</p>
                                            <p className="text-sm mt-2">Integration with charting library needed</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Test Performance */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Test Performance</CardTitle>
                            <CardDescription>Most popular tests and their booking frequency</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tests.slice(0, 5).map((test, index) => {
                                    const testBookings = bookings.filter(b => b.test?._id === test._id);
                                    const completedTestBookings = testBookings.filter(b => b.status === 'completed');

                                    return (
                                        <div key={test._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{test.title}</div>
                                                    <div className="text-sm text-gray-500 dark:text-slate-400">{test.type}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{testBookings.length} bookings</div>
                                                <div className="text-sm text-gray-500 dark:text-slate-400">
                                                    ${(completedTestBookings.length * test.price).toLocaleString()} revenue
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Summary</CardTitle>
                            <CardDescription>Key insights and recommendations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900 dark:text-slate-100">Key Insights</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm">
                                                {Math.round((stats.completedBookings / stats.totalBookings) * 100)}% completion rate is above average
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm">Revenue has increased by 15% this month</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            <span className="text-sm">{stats.pendingBookings} bookings need attention</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900 dark:text-slate-100">Recommendations</h4>
                                    <div className="space-y-2">
                                        <div className="text-sm text-gray-600 dark:text-slate-400">
                                            • Focus on reducing pending booking wait times
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-slate-400">
                                            • Consider adding more popular test types
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-slate-400">
                                            • Implement automated confirmation system
                                        </div>
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

export default HCSReports;