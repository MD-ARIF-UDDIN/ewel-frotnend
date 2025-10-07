import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar, Clock, FileText } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const HCSDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        totalTests: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingsResponse, testsResponse] = await Promise.all([
                api.get('/bookings'),
                api.get('/tests'),
            ]);

            setBookings(bookingsResponse.data.data);
            setTests(testsResponse.data.data);

            // Calculate stats
            const bookingsData = bookingsResponse.data.data;
            const stats = {
                totalBookings: bookingsData.length,
                pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
                confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
                completedBookings: bookingsData.filter(b => b.status === 'completed').length,
                totalTests: testsResponse.data.data.length,
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

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
                <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen transition-colors duration-300">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">HCS Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-slate-300">Manage your healthcare center's tests and bookings</p>
                    </div>

                    {/* Overview Content */}
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pendingBookings}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.confirmedBookings}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedBookings}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalTests}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div
                                        className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-300 transform hover:scale-105"
                                        onClick={() => navigate('/dashboard/hcs/tests')}
                                    >
                                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                                        <h3 className="font-medium text-blue-900 dark:text-blue-100">Manage Tests</h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Add or edit available tests</p>
                                    </div>
                                    <div
                                        className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-300 transform hover:scale-105"
                                        onClick={() => navigate('/dashboard/hcs/bookings')}
                                    >
                                        <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                        <h3 className="font-medium text-green-900 dark:text-green-100">View Bookings</h3>
                                        <p className="text-sm text-green-600 dark:text-green-300 mt-1">Manage patient appointments</p>
                                    </div>
                                    <div
                                        className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-center cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300 transform hover:scale-105"
                                        onClick={() => navigate('/dashboard/hcs/reports')}
                                    >
                                        <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                                        <h3 className="font-medium text-purple-900 dark:text-purple-100">View Reports</h3>
                                        <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">Analytics and insights</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HCSDashboard;