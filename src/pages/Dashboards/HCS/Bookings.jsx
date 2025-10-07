import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Calendar, Clock, Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';

const HCSBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 0,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false
    });

    const { toast } = useToast();

    useEffect(() => {
        fetchBookings();
    }, [searchTerm, statusFilter, pagination.page]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page || 1);
            params.append('limit', pagination.limit || 50);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const response = await api.get(`/bookings?${params.toString()}`);
            setBookings(response.data.data);
            setPagination(response.data.pagination || {
                page: 1,
                limit: 50,
                totalPages: 0,
                totalBookings: 0,
                hasNext: false,
                hasPrev: false
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Set default pagination values in case of error
            setPagination({
                page: 1,
                limit: 50,
                totalPages: 0,
                totalBookings: 0,
                hasNext: false,
                hasPrev: false
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBookingStatus = async (bookingId, status) => {
        try {
            await api.put(`/bookings/${bookingId}`, { status });
            toast.success('Success', 'Booking status updated successfully');
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Error', 'Failed to update booking status: ' + (error.response?.data?.message || error.message));
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
            confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
            canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        };

        return (
            <Badge className={variants[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Bookings Management</h1>
                        <p className="text-gray-600 dark:text-slate-300">Manage patient bookings and appointments</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-400" />
                                <Input
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white/10 backdrop-blur-md border-white/20 dark:bg-slate-700/50"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </select>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>Complete list of patient appointments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Patient</TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Test</TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Scheduled Date</TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Status</TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking._id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{booking.user.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-slate-400">{booking.user.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{booking.test.title}</div>
                                                        <div className="text-sm text-gray-500 dark:text-slate-400">{booking.test.type}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-400" />
                                                        {formatDate(booking.scheduledAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(booking.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {booking.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                                                >
                                                                    Confirm
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleUpdateBookingStatus(booking._id, 'canceled')}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                                                            >
                                                                Complete
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalBookings)} of {pagination.totalBookings} bookings
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={!pagination.hasPrev}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={!pagination.hasNext}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HCSBookings;