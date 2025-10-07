import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '../../../components/ui/modal';
import { Users, Edit, Trash2, UserPlus, Eye, Search, ChevronLeft, ChevronRight, Key } from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';

const SuperadminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        address: '',
    });
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [changingPasswordUser, setChangingPasswordUser] = useState(null);
    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalPages: 1,
        totalUsers: 0,
        hasNext: false,
        hasPrev: false
    });

    const { toast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter, pagination.page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (roleFilter) {
                params.append('role', roleFilter);
            }

            const response = await api.get(`/users?${params.toString()}`);
            setUsers(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setIsFormSubmitting(true);
        try {
            // Validate required fields
            if (!userForm.name?.trim()) {
                toast.error('Error', 'Name is required');
                setIsFormSubmitting(false);
                return;
            }

            if (!userForm.email?.trim()) {
                toast.error('Error', 'Email is required');
                setIsFormSubmitting(false);
                return;
            }

            if (!userForm.role) {
                toast.error('Error', 'Role is required');
                setIsFormSubmitting(false);
                return;
            }

            if (!userForm.phone?.trim()) {
                toast.error('Error', 'Phone number is required');
                setIsFormSubmitting(false);
                return;
            }

            if (!userForm.address?.trim()) {
                toast.error('Error', 'Address is required');
                setIsFormSubmitting(false);
                return;
            }

            // Only send fields that have values
            const formData = {};
            Object.keys(userForm).forEach(key => {
                if (userForm[key] !== '' && userForm[key] !== undefined) {
                    formData[key] = userForm[key];
                }
            });

            if (editingUser) {
                await api.put(`/users/${editingUser._id}`, formData);
                toast.success('Success', 'User updated successfully');
            } else {
                await api.post('/users', formData);
                toast.success('Success', 'User created successfully');
            }

            setShowUserModal(false);
            setEditingUser(null);
            setUserForm({ name: '', email: '', password: '', role: '', phone: '', address: '' });
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            // Only show error if we're actually submitting the form, not just closing the modal
            if (isFormSubmitting) {
                toast.error('Error', 'Failed to save user: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setIsFormSubmitting(false);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || '',
            phone: user.phone || '',
            address: user.address || '',
        });
        setShowUserModal(true);
    };

    const handleViewUser = (user) => {
        setViewingUser(user);
        setShowViewModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                toast.success('Success', 'User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Error', 'Failed to delete user: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleChangePassword = (user) => {
        setChangingPasswordUser(user);
        setPasswordForm({
            newPassword: '',
            confirmPassword: ''
        });
        setShowChangePasswordModal(true);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
            toast.error('Error', 'Password must be at least 6 characters long');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Error', 'Passwords do not match');
            return;
        }

        try {
            await api.put(`/users/${changingPasswordUser._id}/password`, {
                newPassword: passwordForm.newPassword
            });

            toast.success('Success', 'Password updated successfully');
            setShowChangePasswordModal(false);
            setChangingPasswordUser(null);
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Error', 'Failed to change password: ' + (error.response?.data?.message || error.message));
        }
    };

    const getRoleBadge = (role) => {
        const variants = {
            Customer: 'bg-blue-100 text-blue-800',
            'HCS Admin': 'bg-green-100 text-green-800',
            Doctor: 'bg-purple-100 text-purple-800',
            Superadmin: 'bg-red-100 text-red-800',
        };

        return (
            <Badge className={variants[role] || 'bg-gray-100 text-gray-800'}>
                {role}
            </Badge>
        );
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Users Management</h1>
                        <p className="text-gray-600 dark:text-slate-300">Manage system users and their permissions</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-400" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white/10 backdrop-blur-md border-white/20"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                            >
                                <option value="">All Roles</option>
                                <option value="Customer">Customer</option>
                                <option value="HCS Admin">HCS Admin</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Superadmin">Superadmin</option>
                            </select>
                        </div>
                        <Button onClick={() => setShowUserModal(true)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </div>

                    {/* Users Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-100 dark:bg-slate-800">
                                    <TableRow>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Name</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Email</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Role</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Phone</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Status</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-slate-200 h-14">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-gray-100 rounded-full">
                                                        <Users className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewUser(user)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {user.role === 'HCS Admin' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleChangePassword(user)}
                                                        >
                                                            <Key className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteUser(user._id)}
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
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers} users
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

            {/* User Modal */}
            <Modal open={showUserModal} onOpenChange={(open) => {
                if (!open) {
                    // Modal is closing
                    setIsFormSubmitting(false);
                }
                setShowUserModal(open);
            }}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>{editingUser ? 'Edit User' : 'Add New User'}</ModalTitle>
                        <ModalDescription>
                            {editingUser ? 'Update user information' : 'Create a new user account'}
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        {/* Password field only shown when creating a new user */}
                        {!editingUser && (
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={userForm.password}
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                className="glass-select w-full"
                                value={userForm.role}
                                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                required
                            >
                                <option value="">Select role</option>
                                <option value="Customer">Customer</option>
                                <option value="HCS Admin">HCS Admin</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Superadmin">Superadmin</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={userForm.phone}
                                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={userForm.address}
                                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsFormSubmitting(false);
                                    setShowUserModal(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingUser ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            {/* User View Modal */}
            <Modal open={showViewModal} onOpenChange={(open) => {
                if (!open) {
                    // Modal is closing
                    setViewingUser(null);
                }
                setShowViewModal(open);
            }}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>User Details</ModalTitle>
                        <ModalDescription>
                            View user information
                        </ModalDescription>
                    </ModalHeader>
                    <div className="space-y-4">
                        {viewingUser && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Full Name</Label>
                                        <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                                            {viewingUser.name}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                                            {viewingUser.email}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label>Role</Label>
                                    <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                                        {viewingUser.role}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Phone</Label>
                                        <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                                            {viewingUser.phone || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Address</Label>
                                        <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-md">
                                            {viewingUser.address || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label>User ID</Label>
                                    <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-md font-mono text-sm">
                                        {viewingUser._id}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => setShowViewModal(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>

            {/* Change Password Modal */}
            <Modal open={showChangePasswordModal} onOpenChange={(open) => {
                if (!open) {
                    setChangingPasswordUser(null);
                    setPasswordForm({ newPassword: '', confirmPassword: '' });
                }
                setShowChangePasswordModal(open);
            }}>
                <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                    <ModalHeader>
                        <ModalTitle>Change Password</ModalTitle>
                        <ModalDescription>
                            Change password for {changingPasswordUser?.name}
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                required
                                minLength="6"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                required
                                minLength="6"
                                placeholder="Confirm new password"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowChangePasswordModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Change Password
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SuperadminUsers;