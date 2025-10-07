import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import {
    User,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Save,
    AlertCircle,
    CheckCircle,
    Lock,
    Shield,
    Users,
    Building2,
    TestTube
} from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../api/axios';

const MyProfile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: ''
    });
    const [userCreatedAt, setUserCreatedAt] = useState(null);
    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        totalHCS: 0,
        totalBookings: 0,
        totalTests: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
        fetchSystemStats();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/profile');
            const userData = response.data.data;

            setProfileData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                role: userData.role || ''
            });
            setUserCreatedAt(userData.createdAt);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({
                type: 'error',
                text: 'Failed to load profile data'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchSystemStats = async () => {
        try {
            const [usersRes, hcsRes, bookingsRes, testsRes] = await Promise.all([
                api.get('/users'),
                api.get('/hcs'),
                api.get('/bookings'),
                api.get('/tests')
            ]);

            setSystemStats({
                totalUsers: usersRes.data.count || 0,
                totalHCS: hcsRes.data.count || 0,
                totalBookings: bookingsRes.data.count || 0,
                totalTests: testsRes.data.count || 0
            });
        } catch (error) {
            console.error('Error fetching system stats:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            // Only send editable fields (excluding email, phone, password)
            const updateData = {
                name: profileData.name,
                address: profileData.address
            };

            await api.put('/users/profile', updateData);

            setMessage({
                type: 'success',
                text: 'Profile updated successfully!'
            });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600">Manage your personal information and view system overview</p>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            <div className="flex items-center">
                                {message.type === 'success' ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                )}
                                {message.text}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Overview */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Personal Info Card */}
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                                        <Shield className="h-12 w-12 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{profileData.name}</CardTitle>
                                    <CardDescription>
                                        <Badge className="bg-purple-100 text-purple-800">
                                            {profileData.role}
                                        </Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        {profileData.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        {profileData.phone}
                                    </div>
                                    <div className="flex items-start text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                        <span>{profileData.address}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        Member since {formatDate(userCreatedAt || user.createdAt)}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Overview Card */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 mr-2 text-purple-600" />
                                        <CardTitle className="text-lg">System Overview</CardTitle>
                                    </div>
                                    <CardDescription>Platform statistics and metrics</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                                            <span className="text-sm text-gray-600">Total Users</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{systemStats.totalUsers}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Building2 className="h-4 w-4 mr-2 text-green-500" />
                                            <span className="text-sm text-gray-600">Healthcare Centers</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{systemStats.totalHCS}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <TestTube className="h-4 w-4 mr-2 text-orange-500" />
                                            <span className="text-sm text-gray-600">Available Tests</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{systemStats.totalTests}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                                            <span className="text-sm text-gray-600">Total Bookings</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{systemStats.totalBookings}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Profile Edit Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Edit Profile</CardTitle>
                                    <CardDescription>
                                        Update your personal information. Note: Email and phone cannot be changed for security reasons.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Email Field (Read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                value={profileData.email}
                                                disabled
                                                className="bg-gray-50 text-gray-500"
                                            />
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                        </div>
                                        <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
                                    </div>

                                    {/* Phone Field (Read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                value={profileData.phone}
                                                disabled
                                                className="bg-gray-50 text-gray-500"
                                            />
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                        </div>
                                        <p className="text-xs text-gray-500">Phone number cannot be changed for security reasons</p>
                                    </div>

                                    {/* Address Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={profileData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter your address"
                                        />
                                    </div>

                                    {/* Role Field (Read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <div className="relative">
                                            <Input
                                                id="role"
                                                value={profileData.role}
                                                disabled
                                                className="bg-gray-50 text-gray-500"
                                            />
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                        </div>
                                        <p className="text-xs text-gray-500">Role cannot be changed</p>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full sm:w-auto"
                                        >
                                            {saving ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saving...
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;