import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Calendar, Clock, MapPin, Plus, Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 1,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false
    });
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        fetchBookings();
    }, [searchTerm, statusFilter, pagination.page]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const response = await api.get(`/bookings?${params.toString()}`);
            setBookings(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.put(`/bookings/${bookingId}/cancel`);
                toast.success('Success', 'Booking canceled successfully');
                fetchBookings();
            } catch (error) {
                console.error('Error canceling booking:', error);
                toast.error('Error', 'Failed to cancel booking: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleViewBooking = async (bookingId) => {
        try {
            const response = await api.get(`/bookings/${bookingId}`);
            setSelectedBooking(response.data.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching booking details:', error);
            toast.error('Error', 'Failed to fetch booking details: ' + (error.response?.data?.message || error.message));
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBooking(null);
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            canceled: 'bg-red-100 text-red-800',
        };

        return (
            <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
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
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Bookings</h1>
                                <p className="text-gray-600 dark:text-gray-300">View and manage your healthcare appointments</p>
                            </div>
                            <Button onClick={() => window.location.href = '/healthcare'}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Booking
                            </Button>
                        </div>
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
                                <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{stats.confirmedBookings}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white/10 backdrop-blur-md border-white/20"
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
                            <CardDescription>Your complete healthcare appointment history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No bookings yet</h3>
                                    <p className="text-gray-500 dark:text-slate-300 mb-4">Start by booking your first healthcare test</p>
                                    <Button
                                        className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                                        onClick={() => window.location.href = '/healthcare'}>
                                        Book a Test
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Test</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Healthcare Center</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Scheduled Date</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Status</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Amount</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings.map((booking) => (
                                                <TableRow key={booking._id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{booking.test.title}</div>
                                                            <div className="text-sm text-gray-500">{booking.test.type}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                            <div>
                                                                <div className="font-medium">{booking.hcs.name}</div>
                                                                <div className="text-sm text-gray-500">{booking.hcs.address}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                            {formatDate(booking.scheduledAt)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(booking.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium">${booking.test.price}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button size="sm" variant="outline" onClick={() => handleViewBooking(booking._id)}>
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            {booking.status === 'pending' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleCancelBooking(booking._id)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
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

            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Details</h2>
                                <Button variant="ghost" onClick={closeModal}>×</Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Test Information</h3>
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Test:</span> {selectedBooking.test.title}</p>
                                            <p><span className="font-medium">Type:</span> {selectedBooking.test.type}</p>
                                            <p><span className="font-medium">Price:</span> ${selectedBooking.test.price}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Booking Information</h3>
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Status:</span> {getStatusBadge(selectedBooking.status)}</p>
                                            <p><span className="font-medium">Scheduled:</span> {formatDate(selectedBooking.scheduledAt)}</p>
                                            <p><span className="font-medium">Booked:</span> {formatDate(selectedBooking.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Healthcare Center</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Name:</span> {selectedBooking.hcs.name}</p>
                                        <p><span className="font-medium">Address:</span> {selectedBooking.hcs.address}</p>
                                        <p><span className="font-medium">Contact:</span> {selectedBooking.hcs.contact}</p>
                                    </div>
                                </div>

                                {selectedBooking.user && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customer Information</h3>
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Name:</span> {selectedBooking.user.name}</p>
                                            <p><span className="font-medium">Email:</span> {selectedBooking.user.email}</p>
                                            <p><span className="font-medium">Phone:</span> {selectedBooking.user.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <Button variant="outline" onClick={closeModal}>Close</Button>
                                {selectedBooking.status === 'pending' && (
                                    <Button variant="destructive" onClick={() => handleCancelBooking(selectedBooking._id)}>
                                        Cancel Booking
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserBookings;