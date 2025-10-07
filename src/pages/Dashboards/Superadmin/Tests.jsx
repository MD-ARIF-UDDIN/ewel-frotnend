import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '../../../components/ui/modal';
import { FileText, Plus, Edit, Trash2, Search, Filter, ChevronLeft, ChevronRight, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';
import MultiHCSSlotChecker from '../../../components/MultiHCSSlotChecker';

const SuperadminTests = () => {
    const [tests, setTests] = useState([]);
    const [hcs, setHcs] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTestModal, setShowTestModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showSlotChecker, setShowSlotChecker] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [activeTab, setActiveTab] = useState('tests'); // 'tests' or 'requests'
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [testForm, setTestForm] = useState({
        title: '',
        description: '',
        type: '',
        price: '',
        duration: '',
    });
    const [assignForm, setAssignForm] = useState({
        hcs: '',
        price: '',
        slots: ''
    });
    const [reviewForm, setReviewForm] = useState({
        status: 'approved',
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
            fetchData();
        } else {
            fetchRequests();
        }
    }, [activeTab, searchTerm, typeFilter, statusFilter, pagination.page, requestsPagination.page]);

    const fetchData = async () => {
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

            const [testsResponse, hcsResponse] = await Promise.all([
                api.get(`/tests?${params.toString()}`),
                api.get('/hcs'),
            ]);
            setTests(testsResponse.data.data);
            setHcs(hcsResponse.data.data);
            setPagination(testsResponse.data.pagination);
        } catch (error) {
            console.error('Error fetching data:', error);
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

            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const response = await api.get(`/tests/assignment-requests?${params.toString()}`);
            setRequests(response.data.data);
            setRequestsPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTest) {
                await api.put(`/tests/${editingTest._id}`, testForm);
                toast.success('Success', 'Test updated successfully');
            } else {
                await api.post('/tests', testForm);
                toast.success('Success', 'Test created successfully');
            }

            setShowTestModal(false);
            setEditingTest(null);
            setTestForm({ title: '', description: '', type: '', price: '', duration: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving test:', error);
            toast.error('Error', 'Failed to save test: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/tests/${selectedTest._id}/assign-hcs`, assignForm);
            toast.success('Success', 'Test assigned to HCS successfully');
            setShowAssignModal(false);
            setAssignForm({ hcs: '', price: '', slots: '' });
            setSelectedTest(null);
            fetchData();
        } catch (error) {
            console.error('Error assigning test:', error);
            toast.error('Error', 'Failed to assign test: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tests/assignment-requests/${selectedRequest._id}`, reviewForm);
            toast.success('Success', `Test assignment request ${reviewForm.status} successfully`);
            setShowReviewModal(false);
            setReviewForm({ status: 'approved', notes: '' });
            setSelectedRequest(null);
            // Refresh requests
            if (activeTab === 'requests') {
                fetchRequests();
            }
        } catch (error) {
            console.error('Error reviewing request:', error);
            toast.error('Error', 'Failed to review request: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEditTest = (test) => {
        setEditingTest(test);
        setTestForm({
            title: test.title,
            description: test.description,
            type: test.type,
            price: test.price.toString(),
            duration: test.duration.toString(),
        });
        setShowTestModal(true);
    };

    const handleDeleteTest = async (testId) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            try {
                await api.delete(`/tests/${testId}`);
                toast.success('Success', 'Test deleted successfully');
                fetchData();
            } catch (error) {
                console.error('Error deleting test:', error);
                toast.error('Error', 'Failed to delete test: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleRemoveHCS = async (testId, hcsId) => {
        if (window.confirm('Are you sure you want to remove this HCS from the test?')) {
            try {
                await api.delete(`/tests/${testId}/remove-hcs/${hcsId}`);
                toast.success('Success', 'HCS removed from test successfully');
                fetchData();
            } catch (error) {
                console.error('Error removing HCS:', error);
                toast.error('Error', 'Failed to remove HCS: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleAssignTest = (test) => {
        setSelectedTest(test);
        setShowAssignModal(true);
    };

    const handleReviewRequest = (request) => {
        setSelectedRequest(request);
        setReviewForm({
            status: 'approved',
            notes: request.notes || ''
        });
        setShowReviewModal(true);
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

    // Function to update HCS slots
    const handleUpdateSlots = async (hcsId, slots) => {
        try {
            await api.put(`/hcs/${hcsId}`, { availableSlotsPerDay: slots });
            toast.success('Success', 'Available slots updated successfully');
            // Refresh HCS data
            const response = await api.get('/hcs');
            setHcs(response.data.data);
        } catch (error) {
            console.error('Error updating slots:', error);
            toast.error('Error', 'Failed to update available slots: ' + (error.response?.data?.message || error.message));
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
                        <h1 className="text-3xl font-bold text-gray-900">Tests Management</h1>
                        <p className="text-gray-600">Manage all available medical tests and assignment requests in the system</p>
                    </div>

                    {/* Slot Availability Button */}
                    <div className="mb-6">
                        <Button onClick={() => setShowSlotChecker(true)}>
                            <Users className="h-4 w-4 mr-2" />
                            Check Slot Availability
                        </Button>
                    </div>

                    {/* Tabs for Tests and Requests */}
                    <div className="mb-6 border-b border-gray-200 dark:border-slate-700">
                        <nav className="flex space-x-8">
                            <button
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-500'}`}
                                onClick={() => setActiveTab('tests')}
                            >
                                Tests
                            </button>
                            <button
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-500'}`}
                                onClick={() => setActiveTab('requests')}
                            >
                                Assignment Requests
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
                                <Button onClick={() => setShowTestModal(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Test
                                </Button>
                            </div>

                            {/* Tests Table */}
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-gray-100 dark:bg-slate-800">
                                            <TableRow>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Title</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Type</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Base Price</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Duration</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Assigned HCS</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tests.map((test) => (
                                                <TableRow key={test._id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{test.title}</div>
                                                            <div className="text-sm text-gray-500">{test.description}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{test.type}</Badge>
                                                    </TableCell>
                                                    <TableCell>${test.price}</TableCell>
                                                    <TableCell>{test.duration} min</TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {test.hcsPricing?.length ? (
                                                                <div>
                                                                    {test.hcsPricing.slice(0, 2).map((pricing) => (
                                                                        <div key={pricing.hcs?._id || pricing._id} className="flex justify-between items-center mb-1">
                                                                            <span>{pricing.hcs?.name || 'Unknown HCS'}</span>
                                                                            <span className="font-medium">${pricing.price}</span>
                                                                            <span className="text-gray-500 text-xs">
                                                                                Slots: {pricing.hcs?.availableSlotsPerDay || 10}
                                                                            </span>
                                                                            <div className="flex items-center space-x-2">
                                                                                <Input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    max="100"
                                                                                    value={pricing.hcs?.availableSlotsPerDay || 10}
                                                                                    onChange={(e) => {
                                                                                        const updatedHcs = hcs.map(h => {
                                                                                            if (h._id === pricing.hcs?._id) {
                                                                                                return { ...h, availableSlotsPerDay: parseInt(e.target.value) || 0 };
                                                                                            }
                                                                                            return h;
                                                                                        });
                                                                                        setHcs(updatedHcs);
                                                                                    }}
                                                                                    className="w-16"
                                                                                />
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => handleUpdateSlots(pricing.hcs?._id, pricing.hcs?.availableSlotsPerDay || 10)}
                                                                                    className="h-6 px-2"
                                                                                    disabled={!pricing.hcs}
                                                                                >
                                                                                    Save
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="destructive"
                                                                                    className="ml-2 h-6 px-2"
                                                                                    onClick={() => handleRemoveHCS(test._id, pricing.hcs?._id)}
                                                                                    disabled={!pricing.hcs}
                                                                                >
                                                                                    Remove
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {test.hcsPricing.length > 2 && (
                                                                        <div className="text-gray-500">
                                                                            +{test.hcsPricing.length - 2} more
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500">No centers assigned</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEditTest(test)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleAssignTest(test)}
                                                            >
                                                                <Users className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDeleteTest(test._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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
                            {/* Requests Actions */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* Requests Table */}
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-gray-100 dark:bg-slate-800">
                                            <TableRow>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Test</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">HCS</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Requested Price</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Status</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Requested By</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Requested At</TableHead>
                                                <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.map((request) => (
                                                <TableRow key={request._id}>
                                                    <TableCell>
                                                        <div className="font-medium">{request.test.title}</div>
                                                        <div className="text-sm text-gray-500">{request.test.description}</div>
                                                    </TableCell>
                                                    <TableCell>{request.hcs?.name || 'Unknown HCS'}</TableCell>
                                                    <TableCell>${request.requestedPrice}</TableCell>
                                                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                                                    <TableCell>{request.requestedBy?.name || 'Unknown User'}</TableCell>
                                                    <TableCell>
                                                        {new Date(request.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.status === 'pending' ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleReviewRequest(request)}
                                                            >
                                                                Review
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleReviewRequest(request)}
                                                            >
                                                                View
                                                            </Button>
                                                        )}
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

            {/* Slot Availability Modal */}
            <Modal open={showSlotChecker} onOpenChange={setShowSlotChecker}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl max-w-3xl">
                    <ModalHeader>
                        <ModalTitle>Multi-HCS Slot Availability</ModalTitle>
                        <ModalDescription>
                            Check slot availability across different healthcare centers
                        </ModalDescription>
                    </ModalHeader>
                    <div className="p-6">
                        <MultiHCSSlotChecker hcsList={hcs} testList={tests} />
                    </div>
                </ModalContent>
            </Modal>

            {/* Test Modal */}
            <Modal open={showTestModal} onOpenChange={setShowTestModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>{editingTest ? 'Edit Test' : 'Add New Test'}</ModalTitle>
                        <ModalDescription>
                            {editingTest ? 'Update test information' : 'Create a new medical test'}
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handleTestSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Test Title</Label>
                            <Input
                                id="title"
                                value={testForm.title}
                                onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={testForm.description}
                                onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="type">Test Type</Label>
                            <select
                                id="type"
                                className="glass-select w-full"
                                value={testForm.type}
                                onChange={(e) => setTestForm({ ...testForm, type: e.target.value })}
                                required
                            >
                                <option value="">Select type</option>
                                <option value="Blood Test">Blood Test</option>
                                <option value="X-Ray">X-Ray</option>
                                <option value="MRI">MRI</option>
                                <option value="CT Scan">CT Scan</option>
                                <option value="Ultrasound">Ultrasound</option>
                                <option value="ECG">ECG</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Base Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={testForm.price}
                                    onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration (min)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={testForm.duration}
                                    onChange={(e) => setTestForm({ ...testForm, duration: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowTestModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingTest ? 'Update Test' : 'Create Test'}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            {/* Assign HCS Modal */}
            <Modal open={showAssignModal} onOpenChange={setShowAssignModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>Assign Test to HCS</ModalTitle>
                        <ModalDescription>
                            Assign this test to a healthcare center with a specific price and slot count
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handleAssignSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="hcs">Healthcare Center</Label>
                            <select
                                id="hcs"
                                className="glass-select w-full"
                                value={assignForm.hcs}
                                onChange={(e) => setAssignForm({ ...assignForm, hcs: e.target.value })}
                                required
                            >
                                <option value="">Select HCS</option>
                                {hcs?.map((center) => (
                                    <option key={center._id} value={center._id}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={assignForm.price}
                                onChange={(e) => setAssignForm({ ...assignForm, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="slots">Available Slots Per Day</Label>
                            <Input
                                id="slots"
                                type="number"
                                min="0"
                                max="100"
                                value={assignForm.slots}
                                onChange={(e) => setAssignForm({ ...assignForm, slots: e.target.value })}
                                placeholder="Enter number of slots per day"
                            />
                            <p className="text-sm text-gray-500 mt-1">Leave blank to keep current slot count</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Assign Test
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            {/* Review Modal */}
            <Modal open={showReviewModal} onOpenChange={setShowReviewModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>Review Test Assignment Request</ModalTitle>
                        <ModalDescription>
                            Review and approve/reject this test assignment request
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="test">Test</Label>
                            <div className="text-sm font-medium">{selectedRequest?.test.title}</div>
                            <div className="text-xs text-gray-500">{selectedRequest?.test.description}</div>
                        </div>
                        <div>
                            <Label htmlFor="hcs">Healthcare Center</Label>
                            <div className="text-sm font-medium">{selectedRequest?.hcs?.name || 'Unknown HCS'}</div>
                        </div>
                        <div>
                            <Label htmlFor="requestedPrice">Requested Price</Label>
                            <div className="text-sm font-medium">${selectedRequest?.requestedPrice}</div>
                        </div>
                        <div>
                            <Label htmlFor="requestedBy">Requested By</Label>
                            <div className="text-sm font-medium">{selectedRequest?.requestedBy?.name || 'Unknown User'}</div>
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className="glass-select w-full"
                                value={reviewForm.status}
                                onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                                required
                            >
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <textarea
                                id="notes"
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                value={reviewForm.notes}
                                onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {reviewForm.status === 'approved' ? 'Approve Request' : 'Reject Request'}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SuperadminTests;