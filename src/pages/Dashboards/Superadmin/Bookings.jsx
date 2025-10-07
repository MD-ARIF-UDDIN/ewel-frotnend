import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '../../../components/ui/modal';
import { Calendar, Search, Filter, Download, Eye, Edit, ChevronLeft, ChevronRight, User, Stethoscope, MapPin, Clock } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';

const SuperadminBookings = () => {
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        status: ''
    });

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

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'bg-blue-100 text-blue-800',
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

    const handleEditBooking = (booking) => {
        setSelectedBooking(booking);
        setEditForm({
            status: booking.status
        });
        setShowEditModal(true);
    };

    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/bookings/${selectedBooking._id}`, editForm);
            toast.success('Success', 'Booking updated successfully');
            setShowEditModal(false);
            setSelectedBooking(null);
            setEditForm({ status: '' });
            fetchBookings(); // Refresh the bookings list
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Error', 'Failed to update booking: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            <Sidebar />

            <div className="flex-1 lg:ml-64">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Bookings Management</h1>
                        <p className="text-gray-600 dark:text-slate-300">Monitor and manage all system bookings</p>
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
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {bookings.filter(b => b.status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Pending</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {bookings.filter(b => b.status === 'confirmed').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Confirmed</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-600">
                                        {bookings.filter(b => b.status === 'completed').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Completed</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {bookings.filter(b => b.status === 'canceled').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Canceled</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bookings Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-100 dark:bg-slate-800">
                                    <TableRow>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Patient</TableHead>
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
                                                    <div className="font-medium">{booking.user?.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{booking.user?.email || 'N/A'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.test?.title || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{booking.test?.type || 'N/A'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.hcs?.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{booking.hcs?.address || 'N/A'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    {formatDate(booking.scheduledAt)}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell>
                                                <span className="font-medium">${booking.test?.price || 0}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditBooking(booking)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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

            {/* Edit Booking Modal */}
            <Modal open={showEditModal} onOpenChange={setShowEditModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>Edit Booking</ModalTitle>
                        <ModalDescription>
                            Update booking information
                        </ModalDescription>
                    </ModalHeader>
                    {selectedBooking && (
                        <form onSubmit={handleUpdateBooking} className="space-y-4 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="patient">Patient</Label>
                                    <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium">{selectedBooking.user?.name || 'N/A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="test">Test</Label>
                                    <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <Stethoscope className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium">{selectedBooking.test?.title || 'N/A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="hcs">Healthcare Center</Label>
                                    <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium">{selectedBooking.hcs?.name || 'N/A'}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="scheduledAt">Scheduled Date</Label>
                                    <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium">{formatDate(selectedBooking.scheduledAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Update Booking
                                </Button>
                            </div>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SuperadminBookings;