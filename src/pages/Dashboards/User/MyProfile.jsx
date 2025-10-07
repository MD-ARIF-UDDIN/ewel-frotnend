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
    Camera,
    X
} from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../api/axios';
import { getProfileImageUrl } from '../../../utils/profileImage';

const MyProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        profilePhoto: ''
    });
    const [userCreatedAt, setUserCreatedAt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        fetchProfile();
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
                role: userData.role || '',
                profilePhoto: userData.profilePhoto || ''
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

            // If we have a photo to upload, use FormData
            if (selectedPhoto) {
                // Create FormData for file upload
                const formData = new FormData();
                formData.append('name', profileData.name);
                formData.append('address', profileData.address);
                formData.append('profilePhoto', selectedPhoto);

                const response = await api.put('/users/profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Update profile data with response
                const updatedUser = response.data.data;
                setProfileData(prev => ({
                    ...prev,
                    name: updatedUser.name,
                    address: updatedUser.address,
                    profilePhoto: updatedUser.profilePhoto
                }));

                // Update user context
                updateUserProfile(updatedUser);

                // Clear photo selection and preview
                setSelectedPhoto(null);
                setPhotoPreview(null);
            } else {
                // If no photo, send JSON data
                const updateData = {};
                if (profileData.name) updateData.name = profileData.name;
                if (profileData.address) updateData.address = profileData.address;

                const response = await api.put('/users/profile', updateData);

                // Update profile data with response
                const updatedUser = response.data.data;
                setProfileData(prev => ({
                    ...prev,
                    name: updatedUser.name,
                    address: updatedUser.address,
                    profilePhoto: updatedUser.profilePhoto
                }));

                // Update user context
                updateUserProfile(updatedUser);
            }

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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setMessage({
                    type: 'error',
                    text: 'Please select a valid image file.'
                });
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({
                    type: 'error',
                    text: 'Image size must be less than 5MB.'
                });
                return;
            }

            setSelectedPhoto(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhotoSelection = () => {
        setSelectedPhoto(null);
        setPhotoPreview(null);
        // Reset file input
        const fileInput = document.getElementById('profilePhotoInput');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const getProfileImageUrlToDisplay = () => {
        // If we have a photo preview (from file selection), use it
        if (photoPreview) {
            return photoPreview;
        }
        // Otherwise, use the saved profile photo
        return getProfileImageUrl(profileData.profilePhoto);
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
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600">Manage your personal information and account settings</p>
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
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                        {getProfileImageUrlToDisplay() ? (
                                            <img
                                                src={getProfileImageUrlToDisplay()}
                                                alt={profileData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                                <User className="h-12 w-12 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl">{profileData.name}</CardTitle>
                                    <div className="mt-2">
                                        <Badge className="bg-blue-100 text-blue-800">
                                            {profileData.role}
                                        </Badge>
                                    </div>
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
                                    {/* Profile Photo Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="profilePhotoInput">Profile Photo</Label>
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                                                    {getProfileImageUrlToDisplay() ? (
                                                        <img
                                                            src={getProfileImageUrlToDisplay()}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                            <Camera className="h-8 w-8 text-blue-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                {(photoPreview || selectedPhoto) && (
                                                    <button
                                                        type="button"
                                                        onClick={removePhotoSelection}
                                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center space-y-2">
                                                <label htmlFor="profilePhotoInput" className="cursor-pointer">
                                                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                                                        {getProfileImageUrlToDisplay() ? 'Change Photo' : 'Upload Photo'}
                                                    </div>
                                                </label>
                                                <input
                                                    id="profilePhotoInput"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                                <p className="text-xs text-gray-500 text-center">
                                                    JPG, PNG up to 5MB<br />
                                                    Recommended: 300x300px
                                                </p>
                                            </div>
                                        </div>
                                    </div>

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