import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '../../../components/ui/modal';
import { FileText, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';

const HCSTests = () => {
    const [tests, setTests] = useState([]);
    const [hcs, setHcs] = useState(null);
    const [hcsError, setHcsError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTestModal, setShowTestModal] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [testForm, setTestForm] = useState({
        title: '',
        description: '',
        type: '',
        price: '',
        duration: '',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 0,
        totalTests: 0,
        hasNext: false,
        hasPrev: false
    });

    // Tab state
    const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' or 'request'

    // Request test state
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedTestForRequest, setSelectedTestForRequest] = useState(null);
    const [requestForm, setRequestForm] = useState({
        price: '',
        notes: ''
    });

    const { toast } = useToast();

    useEffect(() => {
        if (activeTab === 'assigned') {
            fetchTests();
        } else {
            fetchTestsNotAssigned();
        }
        fetchHCSInfo();
    }, [searchTerm, typeFilter, pagination.page, activeTab]);

    const fetchHCSInfo = async () => {
        try {
            const response = await api.get('/hcs/my-hcs');
            setHcs(response.data.data);
            setHcsError(null);
        } catch (error) {
            console.error('Error fetching HCS info:', error);
            setHcsError(error.message || 'Failed to fetch HCS information');
            toast.error('Error', 'Failed to fetch HCS information: ' + (error.response?.data?.message || error.message));
            // Set hcs to null if there's an error
            setHcs(null);
        }
    };

    const fetchTests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page || 1);
            params.append('limit', pagination.limit || 50);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (typeFilter) {
                params.append('type', typeFilter);
            }

            // Only fetch tests assigned to this HCS
            if (hcs) {
                params.append('hcs', hcs._id);
            }

            const response = await api.get(`/tests?${params.toString()}`);
            setTests(response.data.data || []);
            setPagination(response.data.pagination || {
                page: 1,
                limit: 50,
                totalPages: 0,
                totalTests: 0,
                hasNext: false,
                hasPrev: false
            });
        } catch (error) {
            console.error('Error fetching tests:', error);
            toast.error('Error', 'Failed to fetch tests: ' + (error.response?.data?.message || error.message));
            // Set default values in case of error
            setTests([]);
            setPagination({
                page: 1,
                limit: 50,
                totalPages: 0,
                totalTests: 0,
                hasNext: false,
                hasPrev: false
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchTestsNotAssigned = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page || 1);
            params.append('limit', pagination.limit || 50);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (typeFilter) {
                params.append('type', typeFilter);
            }

            const response = await api.get(`/tests/not-assigned?${params.toString()}`);
            setTests(response.data.data || []);
            setPagination(response.data.pagination || {
                page: 1,
                limit: 50,
                totalPages: 0,
                totalTests: 0,
                hasNext: false,
                hasPrev: false
            });
        } catch (error) {
            console.error('Error fetching tests not assigned:', error);
            toast.error('Error', 'Failed to fetch tests: ' + (error.response?.data?.message || error.message));
            // Set default values in case of error
            setTests([]);
            setPagination({
                page: 1,
                limit: 50,
                totalPages: 0,
                totalTests: 0,
                hasNext: false,
                hasPrev: false
            });
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
            fetchTests();
        } catch (error) {
            console.error('Error saving test:', error);
            toast.error('Error', 'Failed to save test: ' + (error.response?.data?.message || error.message));
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
                fetchTests();
            } catch (error) {
                console.error('Error deleting test:', error);
                toast.error('Error', 'Failed to delete test: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Function to get slots for a specific test
    const getSlotsForTest = (testId) => {
        if (!hcs || !hcs.testSlots) return 10; // Default value
        const testSlot = hcs.testSlots.find(slot => slot.test === testId);
        return testSlot ? testSlot.slotsPerDay : hcs.availableSlotsPerDay || 10;
    };

    // Function to update slots for a specific test
    const updateSlotsForTest = async (testId, slots) => {
        if (!hcs) {
            toast.error('Error', 'HCS information not available');
            return;
        }

        try {
            // Prepare the testSlots array with the updated value
            const updatedTestSlots = [...(hcs.testSlots || [])];
            const existingSlotIndex = updatedTestSlots.findIndex(slot => slot.test === testId);

            if (existingSlotIndex >= 0) {
                updatedTestSlots[existingSlotIndex].slotsPerDay = slots;
            } else {
                updatedTestSlots.push({ test: testId, slotsPerDay: slots });
            }

            await api.put(`/hcs/${hcs._id}`, { testSlots: updatedTestSlots });

            // Update local state
            setHcs({ ...hcs, testSlots: updatedTestSlots });
            toast.success('Success', 'Available slots updated successfully');
        } catch (error) {
            console.error('Error updating slots:', error);
            toast.error('Error', 'Failed to update available slots: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSlotChange = (testId, value) => {
        if (!hcs) return;

        const updatedTestSlots = [...(hcs.testSlots || [])];
        const existingSlotIndex = updatedTestSlots.findIndex(slot => slot.test === testId);

        if (existingSlotIndex >= 0) {
            updatedTestSlots[existingSlotIndex].slotsPerDay = parseInt(value) || 0;
        } else {
            updatedTestSlots.push({ test: testId, slotsPerDay: parseInt(value) || 0 });
        }

        setHcs({ ...hcs, testSlots: updatedTestSlots });
    };

    const handleSaveSlots = async (testId) => {
        if (!hcs) return;

        const testSlot = hcs.testSlots.find(slot => slot.test === testId);
        if (testSlot) {
            await updateSlotsForTest(testId, testSlot.slotsPerDay);
        }
    };

    // Handle request test submission
    const handleRequestTestSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTestForRequest) return;

        try {
            await api.post(`/tests/${selectedTestForRequest._id}/request-assignment`, {
                price: parseFloat(requestForm.price),
                notes: requestForm.notes
            });

            toast.success('Success', 'Test assignment request submitted successfully');
            setShowRequestModal(false);
            setSelectedTestForRequest(null);
            setRequestForm({ price: '', notes: '' });

            // Refresh the tests list
            if (activeTab === 'request') {
                fetchTestsNotAssigned();
            }
        } catch (error) {
            console.error('Error requesting test assignment:', error);
            toast.error('Error', 'Failed to request test assignment: ' + (error.response?.data?.message || error.message));
        }
    };

    // Open request modal for a test
    const openRequestModal = (test) => {
        setSelectedTestForRequest(test);
        setRequestForm({
            price: test.price.toString(),
            notes: ''
        });
        setShowRequestModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
                <div className="p-6 min-h-screen">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Tests Management</h1>
                        <p className="text-gray-600 dark:text-slate-300">Manage available tests at your healthcare center</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
                        <button
                            className={`py-2 px-4 font-medium text-sm ${activeTab === 'assigned' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            onClick={() => {
                                setActiveTab('assigned');
                                setPagination({
                                    page: 1,
                                    limit: 50,
                                    totalPages: 0,
                                    totalTests: 0,
                                    hasNext: false,
                                    hasPrev: false
                                });
                            }}
                        >
                            Assigned Tests
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm ${activeTab === 'request' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                            onClick={() => {
                                setActiveTab('request');
                                setPagination({
                                    page: 1,
                                    limit: 50,
                                    totalPages: 0,
                                    totalTests: 0,
                                    hasNext: false,
                                    hasPrev: false
                                });
                            }}
                        >
                            Request Tests
                        </button>
                    </div>

                    {/* Slots Management Instructions - only show for assigned tests */}
                    {activeTab === 'assigned' && hcsError ? (
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="text-center py-4">
                                    <p className="text-red-500">Error loading HCS information: {hcsError}. Please try refreshing the page.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : activeTab === 'assigned' && hcs ? (
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Available Slots Management</h2>
                                    <p className="text-gray-600 dark:text-slate-300">Set the number of bookings allowed per day for each test</p>
                                    <p className="text-sm text-gray-500 mt-2">Configure slots for each test in the table below</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-400" />
                                <Input
                                    placeholder="Search tests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white/10 backdrop-blur-md border-white/20 dark:bg-slate-700/50"
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
                        {activeTab === 'assigned' && (
                            <Button onClick={() => setShowTestModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Test
                            </Button>
                        )}
                    </div>

                    {/* Tests Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Title</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Type</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Price</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Duration</TableHead>
                                        {activeTab === 'assigned' && (
                                            <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Slots/Day</TableHead>
                                        )}
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
                                            {activeTab === 'assigned' && (
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={getSlotsForTest(test._id)}
                                                            onChange={(e) => handleSlotChange(test._id, e.target.value)}
                                                            className="w-20"
                                                        />
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSaveSlots(test._id)}
                                                            className="h-8 px-2"
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <div className="text-sm text-gray-500 dark:text-slate-400 max-w-xs truncate">
                                                    {test.description}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    {activeTab === 'assigned' ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEditTest(test)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDeleteTest(test._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => openRequestModal(test)}
                                                        >
                                                            <Send className="h-4 w-4 mr-1" />
                                                            Request
                                                        </Button>
                                                    )}
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

            {/* Test Modal - only for assigned tests */}
            {activeTab === 'assigned' && (
                <Modal open={showTestModal} onOpenChange={setShowTestModal}>
                    <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                        <ModalHeader>
                            <ModalTitle>{editingTest ? 'Edit Test' : 'Add New Test'}</ModalTitle>
                            <ModalDescription>
                                {editingTest ? 'Update test information' : 'Create a new test for your healthcare center'}
                            </ModalDescription>
                        </ModalHeader>
                        <form onSubmit={handleTestSubmit} className="space-y-4 p-6">
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
                                    className="glass-select w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
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
                                    <Label htmlFor="price">Price ($)</Label>
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowTestModal(false);
                                        setEditingTest(null);
                                        setTestForm({ title: '', description: '', type: '', price: '', duration: '' });
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingTest ? 'Update Test' : 'Create Test'}
                                </Button>
                            </div>
                        </form>
                    </ModalContent>
                </Modal>
            )}

            {/* Request Test Modal - for requesting tests */}
            <Modal open={showRequestModal} onOpenChange={setShowRequestModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>Request Test Assignment</ModalTitle>
                        <ModalDescription>
                            Request to have this test assigned to your healthcare center
                        </ModalDescription>
                    </ModalHeader>
                    {selectedTestForRequest && (
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="font-semibold text-lg">{selectedTestForRequest.title}</h3>
                            <p className="text-gray-600 dark:text-slate-300">{selectedTestForRequest.description}</p>
                            <div className="mt-2 flex items-center space-x-4">
                                <Badge variant="outline">{selectedTestForRequest.type}</Badge>
                                <span>${selectedTestForRequest.price}</span>
                                <span>{selectedTestForRequest.duration} min</span>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleRequestTestSubmit} className="space-y-4 p-6">
                        <div>
                            <Label htmlFor="price">Proposed Price ($)</Label>
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
                                placeholder="Any additional information for the superadmin..."
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowRequestModal(false);
                                    setSelectedTestForRequest(null);
                                    setRequestForm({ price: '', notes: '' });
                                }}
                            >
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

export default HCSTests;