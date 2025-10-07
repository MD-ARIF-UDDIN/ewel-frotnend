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
    Building2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../api/axios';
import Sidebar from '../../../components/Sidebar';

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
    const [hcsData, setHcsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
        fetchHCSData();
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

    const fetchHCSData = async () => {
        try {
            // Fetch HCS data where current user is admin
            const response = await api.get('/hcs');
            const hcsList = response.data.data;
            const userHCS = hcsList.find(hcs => hcs.admin._id === user.id);
            setHcsData(userHCS);
        } catch (error) {
            console.error('Error fetching HCS data:', error);
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">My Profile</h1>
                        <p className="text-gray-600 dark:text-slate-300">Manage your personal information and healthcare center details</p>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200'
                            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200'
                            }`}>
                            <div className="flex items-center">
                                {message.type === 'success' ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                )}
                                <span>{message.text}</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Overview */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Personal Info Card */}
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                                        <User className="h-12 w-12 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{profileData.name}</CardTitle>
                                    <CardDescription>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                            {profileData.role}
                                        </Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
                                        <span>{profileData.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
                                        <span>{profileData.phone}</span>
                                    </div>
                                    <div className="flex items-start text-sm text-gray-600 dark:text-slate-400">
                                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                                        <span>{profileData.address}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
                                        <span>Member since {formatDate(userCreatedAt || user.createdAt)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Healthcare Center Info Card */}
                            {hcsData && (
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center">
                                            <Building2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                            <CardTitle className="text-lg">Healthcare Center</CardTitle>
                                        </div>
                                        <CardDescription>Your managed healthcare facility</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{hcsData.name}</p>
                                        </div>
                                        <div className="flex items-start text-sm text-gray-600 dark:text-slate-400">
                                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                                            <span>{hcsData.address}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                            <Phone className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
                                            <span>{hcsData.contact}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
                                            <span>{hcsData.email}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
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
                                                className="bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-400"
                                            />
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">Email cannot be changed for security reasons</p>
                                    </div>

                                    {/* Phone Field (Read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                value={profileData.phone}
                                                disabled
                                                className="bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-400"
                                            />
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">Phone number cannot be changed for security reasons</p>
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
                                                className="bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-400"
                                            />
                                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">Role cannot be changed</p>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full sm:w-auto"
                                        >
                                            {saving ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Save className="h-4 w-4 mr-2" />
                                                    <span>Save Changes</span>
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