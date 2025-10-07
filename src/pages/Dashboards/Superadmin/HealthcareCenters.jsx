import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '../../../components/ui/modal';
import { Building, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';

const SuperadminHealthcareCenters = () => {
    const [hcs, setHcs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHCSModal, setShowHCSModal] = useState(false);
    const [editingHCS, setEditingHCS] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [hcsForm, setHcsForm] = useState({
        name: '',
        address: '',
        contact: '',
        email: '',
        admin: '',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 1,
        totalHcs: 0,
        hasNext: false,
        hasPrev: false
    });

    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, [searchTerm, pagination.page]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const [hcsResponse, usersResponse] = await Promise.all([
                api.get(`/hcs?${params.toString()}`),
                api.get('/users'),
            ]);
            setHcs(hcsResponse.data.data);
            setUsers(usersResponse.data.data);
            setPagination(hcsResponse.data.pagination);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleHCSSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHCS) {
                await api.put(`/hcs/${editingHCS._id}`, hcsForm);
                toast.success('Success', 'Healthcare center updated successfully');
            } else {
                await api.post('/hcs', hcsForm);
                toast.success('Success', 'Healthcare center created successfully');
            }

            setShowHCSModal(false);
            setEditingHCS(null);
            setHcsForm({ name: '', address: '', contact: '', email: '', admin: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving HCS:', error);
            toast.error('Error', 'Failed to save healthcare center: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEditHCS = (hcs) => {
        setEditingHCS(hcs);
        setHcsForm({
            name: hcs.name,
            address: hcs.address,
            contact: hcs.contact,
            email: hcs.email,
            admin: hcs.admin._id,
        });
        setShowHCSModal(true);
    };

    const handleDeleteHCS = async (hcsId) => {
        if (window.confirm('Are you sure you want to delete this healthcare center?')) {
            try {
                await api.delete(`/hcs/${hcsId}`);
                toast.success('Success', 'Healthcare center deleted successfully');
                fetchData();
            } catch (error) {
                console.error('Error deleting HCS:', error);
                toast.error('Error', 'Failed to delete healthcare center: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
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
                        <h1 className="text-3xl font-bold text-gray-900">Healthcare Centers</h1>
                        <p className="text-gray-600">Manage healthcare centers and their administrators</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search healthcare centers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white/10 backdrop-blur-md border-white/20"
                                />
                            </div>
                        </div>
                        <Button onClick={() => setShowHCSModal(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Healthcare Center
                        </Button>
                    </div>

                    {/* Healthcare Centers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hcs.map((center) => (
                            <Card key={center._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Building className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{center.name}</CardTitle>
                                                <CardDescription>{center.address}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button size="sm" variant="outline" onClick={() => handleEditHCS(center)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteHCS(center._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Contact:</span>
                                            <span className="ml-2">{center.contact}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Email:</span>
                                            <span className="ml-2">{center.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Admin:</span>
                                            <span className="ml-2">{center.admin.name}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-600">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalHcs)} of {pagination.totalHcs} healthcare centers
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
                </div>
            </div>

            {/* HCS Modal */}
            <Modal open={showHCSModal} onOpenChange={setShowHCSModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>{editingHCS ? 'Edit Healthcare Center' : 'Add New Healthcare Center'}</ModalTitle>
                        <ModalDescription>
                            {editingHCS ? 'Update healthcare center information' : 'Create a new healthcare center'}
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handleHCSSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="hcs-name">Name</Label>
                            <Input
                                id="hcs-name"
                                value={hcsForm.name}
                                onChange={(e) => setHcsForm({ ...hcsForm, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="hcs-address">Address</Label>
                            <Input
                                id="hcs-address"
                                value={hcsForm.address}
                                onChange={(e) => setHcsForm({ ...hcsForm, address: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="hcs-contact">Contact</Label>
                                <Input
                                    id="hcs-contact"
                                    value={hcsForm.contact}
                                    onChange={(e) => setHcsForm({ ...hcsForm, contact: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="hcs-email">Email</Label>
                                <Input
                                    id="hcs-email"
                                    type="email"
                                    value={hcsForm.email}
                                    onChange={(e) => setHcsForm({ ...hcsForm, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="hcs-admin">Admin</Label>
                            <select
                                id="hcs-admin"
                                className="glass-select w-full"
                                value={hcsForm.admin}
                                onChange={(e) => setHcsForm({ ...hcsForm, admin: e.target.value })}
                                required
                            >
                                <option value="">Select admin</option>
                                {users.filter(user => ['HCS Admin', 'Superadmin'].includes(user.role)).map(user => (
                                    <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowHCSModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingHCS ? 'Update HCS' : 'Create HCS'}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SuperadminHealthcareCenters;