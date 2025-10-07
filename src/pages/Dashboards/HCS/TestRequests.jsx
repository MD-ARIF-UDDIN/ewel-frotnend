import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '../../../components/ui/modal';
import { FileText, Plus, Search, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';

const HCSTestRequests = () => {
    const [tests, setTests] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [activeTab, setActiveTab] = useState('tests'); // 'tests' or 'requests'
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [requestForm, setRequestForm] = useState({
        price: '',
        notes: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 1,
        totalTests: 0,
        hasNext: false,
        hasPrev: false
    });
    const [requestsPagination, setRequestsPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 1,
        totalRequests: 0,
        hasNext: false,
        hasPrev: false
    });

    const { toast } = useToast();

    useEffect(() => {
        if (activeTab === 'tests') {
            fetchTests();
        } else {
            fetchRequests();
        }
    }, [activeTab, searchTerm, typeFilter, pagination.page, requestsPagination.page]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (typeFilter) {
                params.append('type', typeFilter);
            }

            const response = await api.get(`/tests?${params.toString()}`);
            setTests(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', requestsPagination.page);
            params.append('limit', requestsPagination.limit);

            const response = await api.get(`/tests/assignment-requests?${params.toString()}`);
            setRequests(response.data.data);
            setRequestsPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/tests/${selectedTest._id}/request-assignment`, requestForm);
            toast.success('Success', 'Test assignment request submitted successfully');
            setShowRequestModal(false);
            setRequestForm({ price: '', notes: '' });
            setSelectedTest(null);
            // Refresh requests
            if (activeTab === 'requests') {
                fetchRequests();
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error('Error', 'Failed to submit request: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRequestTest = (test) => {
        setSelectedTest(test);
        setShowRequestModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <Badge variant="success">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="warning">Pending</Badge>;
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleRequestsPageChange = (newPage) => {
        setRequestsPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Navbar />
                <Sidebar />
                <div className="flex-1 lg:ml-64 pt-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Navbar />
            <Sidebar />

            <div className="flex-1 lg:ml-64 pt-16">
                <div className="p-6 min-h-screen">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Test Assignment Requests</h1>
                        <p className="text-gray-600">Request tests to be assigned to your healthcare center</p>
                    </div>

                    {/* Tabs for Tests and Requests */}
                    <div className="mb-6 border-b border-gray-200 dark:border-slate-700">
                        <nav className="flex space-x-8">
                            <button
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-500'}`}
                                onClick={() => setActiveTab('tests')}
                            >
                                Available Tests
                            </button>
                            <button
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-500'}`}
                                onClick={() => setActiveTab('requests')}
                            >
                                My Requests
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'tests' ? (
                        <>
                            {/* Actions */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search tests..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-64 bg-white/10 backdrop-blur-md border-white/20"
                                        />
                                    </div>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">All Types</option>
                                        <option value="Blood Test">Blood Test</option>
                                        <option value="X-Ray">X-Ray</option>
                                        <option value="MRI">MRI</option>
                                        <option value="CT Scan">CT Scan</option>
                                        <option value="Ultrasound">Ultrasound</option>
                                        <option value="ECG">ECG</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tests Table */}
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Title</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Type</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Base Price</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Duration</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Description</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tests.map((test) => (
                                                <TableRow key={test._id}>
                                                    <TableCell>
                                                        <div className="font-medium">{test.title}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{test.type}</Badge>
                                                    </TableCell>
                                                    <TableCell>${test.price}</TableCell>
                                                    <TableCell>{test.duration} min</TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                                            {test.description}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleRequestTest(test)}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Request
                                                        </Button>
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
                                    <div className="text-sm text-gray-600">
                                        Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalTests)} of {pagination.totalTests} tests
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
                                        <span className="text-sm text-gray-600">
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
                        </>
                    ) : (
                        <>
                            {/* Requests Table */}
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Test</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Requested Price</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Status</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Requested At</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Notes</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.map((request) => (
                                                <TableRow key={request._id}>
                                                    <TableCell>
                                                        <div className="font-medium">{request.test.title}</div>
                                                    </TableCell>
                                                    <TableCell>${request.requestedPrice}</TableCell>
                                                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                                                    <TableCell>
                                                        {new Date(request.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                                            {request.notes || 'No notes'}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Pagination */}
                            {requestsPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-600">
                                        Showing {(requestsPagination.page - 1) * requestsPagination.limit + 1} to {Math.min(requestsPagination.page * requestsPagination.limit, requestsPagination.totalRequests)} of {requestsPagination.totalRequests} requests
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRequestsPageChange(requestsPagination.page - 1)}
                                            disabled={!requestsPagination.hasPrev}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <span className="text-sm text-gray-600">
                                            Page {requestsPagination.page} of {requestsPagination.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRequestsPageChange(requestsPagination.page + 1)}
                                            disabled={!requestsPagination.hasNext}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Request Modal */}
            <Modal open={showRequestModal} onOpenChange={setShowRequestModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>Request Test Assignment</ModalTitle>
                        <ModalDescription>
                            Request to have this test assigned to your healthcare center
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="test">Test</Label>
                            <Input
                                id="test"
                                value={selectedTest?.title || ''}
                                disabled
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Requested Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={requestForm.price}
                                onChange={(e) => setRequestForm({ ...requestForm, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Input
                                id="notes"
                                value={requestForm.notes}
                                onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowRequestModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default HCSTestRequests;