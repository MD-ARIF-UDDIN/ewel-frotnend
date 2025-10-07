import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalTrigger } from '../components/ui/modal';
import { Alert, AlertDescription } from '../components/ui/alert';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, AlertCircle, Heart, Shield, Sparkles, Camera, X } from 'lucide-react';

const LoginCustomer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, forgotPassword, loading } = useAuth();

    // Get redirect info from navigation state
    const redirectTo = location.state?.redirectTo || '/dashboard/user';
    const redirectMessage = location.state?.message;

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        profilePhoto: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const [forgotData, setForgotData] = useState({
        email: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const result = await login(loginData.email, loginData.password);

            if (result.success) {
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => navigate(redirectTo), 1000);
            } else {
                setError(result.message || 'Login failed. Please try again.');
                // Error will persist until user dismisses it or tries again
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            // Error will persist until user dismisses it or tries again
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', registerData.name);
            formData.append('email', registerData.email);
            formData.append('password', registerData.password);
            formData.append('phone', registerData.phone);
            formData.append('address', registerData.address);

            if (registerData.profilePhoto) {
                formData.append('profilePhoto', registerData.profilePhoto);
            }

            const result = await register(formData);

            if (result.success) {
                setSuccess('Account created successfully! Redirecting...');
                setTimeout(() => navigate(redirectTo), 1000);
            } else {
                setError(result.message || 'Registration failed. Please try again.');
                // Error will persist until user dismisses it or tries again
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            // Error will persist until user dismisses it or tries again
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const result = await forgotPassword(forgotData.email);

            if (result.success) {
                setSuccess('Password reset email sent successfully!');
                setTimeout(() => {
                    setShowForgotModal(false);
                    setSuccess('');
                    setForgotData({ email: '' });
                }, 2000);
            } else {
                setError(result.message || 'Failed to send reset email. Please try again.');
                // Error will persist until user dismisses it or tries again
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            // Error will persist until user dismisses it or tries again
        }
    };

    const handleToggleForm = (isLoginForm) => {
        setIsLogin(isLoginForm);
        setError('');
        setSuccess('');
        // Reset photo preview when switching forms
        if (isLoginForm) {
            setPhotoPreview(null);
            setRegisterData(prev => ({ ...prev, profilePhoto: null }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file.');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB.');
                return;
            }

            setRegisterData(prev => ({ ...prev, profilePhoto: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setRegisterData(prev => ({ ...prev, profilePhoto: null }));
        setPhotoPreview(null);
        // Reset file input
        const fileInput = document.getElementById('profilePhoto');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-colors duration-300 pt-20">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                {/* Main Container */}
                <div className="w-full max-w-md">
                    {/* EWEL Brand Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            EWEL
                        </h1>
                        <p className="text-gray-600 dark:text-slate-300 text-sm">
                            Healthcare services at your fingertips
                        </p>
                    </div>

                    {/* Main Card */}
                    <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 shadow-2xl shadow-blue-500/10 dark:shadow-slate-900/50 rounded-2xl transition-colors duration-300">
                        <CardHeader className="text-center pb-6">
                            <div className="flex items-center justify-center mb-3">
                                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                                <CardTitle className="text-2xl font-semibold text-gray-800">
                                    Customer Portal
                                </CardTitle>
                            </div>
                            <CardDescription className="text-gray-600">
                                {isLogin ? 'Welcome back! Sign in to your account' : 'Join EWEL today and access quality healthcare'}
                            </CardDescription>

                            {/* Form Toggle Tabs */}
                            <div className="flex bg-gray-100/60 rounded-lg p-1 mt-6">
                                <button
                                    type="button"
                                    onClick={() => handleToggleForm(true)}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${isLogin
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToggleForm(false)}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${!isLogin
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {redirectMessage && (
                                <Alert className="mt-4 border-blue-200 bg-blue-50/60">
                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-700">
                                        {redirectMessage}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Error Alert */}
                            {error && (
                                <Alert className="mt-4" variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="flex items-center justify-between">
                                            <span>{error}</span>
                                            <button
                                                onClick={() => setError('')}
                                                className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                                                type="button"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Success Alert */}
                            {success && (
                                <Alert className="mt-4 border-green-200 bg-green-50/60">
                                    <Sparkles className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-700">
                                        {success}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            {isLogin ? (
                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email Address
                                        </Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email address"
                                                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                            onClick={() => setShowForgotModal(true)}
                                        >
                                            Forgot your password?
                                        </button>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] rounded-lg h-12"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Signing in...
                                            </div>
                                        ) : (
                                            'Sign In to EWEL'
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Profile Photo Upload */}
                                        <div className="space-y-2 text-center">
                                            <Label htmlFor="profilePhoto" className="text-sm font-medium text-gray-700">
                                                Profile Photo (Optional)
                                            </Label>
                                            <div className="flex flex-col items-center space-y-3">
                                                {photoPreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={photoPreview}
                                                            alt="Profile preview"
                                                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removePhoto}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-2 border-dashed border-blue-300">
                                                        <Camera className="h-8 w-8 text-blue-400" />
                                                    </div>
                                                )}

                                                <label htmlFor="profilePhoto" className="cursor-pointer">
                                                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                                                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                                    </div>
                                                </label>
                                                <input
                                                    id="profilePhoto"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                                <p className="text-xs text-gray-500">
                                                    JPG, PNG up to 5MB
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                Full Name
                                            </Label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                                    value={registerData.name}
                                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
                                                Email Address
                                            </Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                                <Input
                                                    id="reg-email"
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                                    value={registerData.email}
                                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                                Phone Number
                                            </Label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                                    value={registerData.phone}
                                                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                                                Address
                                            </Label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                                <Input
                                                    id="address"
                                                    type="text"
                                                    placeholder="Enter your address"
                                                    className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                                    value={registerData.address}
                                                    onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
                                                Password
                                            </Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                                <Input
                                                    id="reg-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Create a secure password"
                                                    className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                                    value={registerData.password}
                                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] rounded-lg h-12 mt-6"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating account...
                                            </div>
                                        ) : (
                                            'Join EWEL Today'
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* Footer Links */}
                            <div className="mt-8 pt-6 border-t border-gray-200/50 text-center space-y-4">
                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                                    <Link
                                        to="/"
                                        className="flex items-center hover:text-blue-600 transition-colors"
                                    >
                                        <span>← Back to Home</span>
                                    </Link>
                                </div>

                                <div className="text-xs text-gray-400">
                                    By continuing, you agree to EWEL's Terms of Service and Privacy Policy
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Forgot Password Modal */}
            <Modal open={showForgotModal} onOpenChange={setShowForgotModal}>
                <ModalContent className="backdrop-blur-xl bg-white/90 border-white/20 rounded-xl">
                    <ModalHeader>
                        <ModalTitle className="text-xl font-semibold text-gray-800">
                            Reset Your Password
                        </ModalTitle>
                        <ModalDescription className="text-gray-600">
                            Enter your email address and we'll send you a secure reset link.
                        </ModalDescription>
                    </ModalHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        {/* Error Alert in Modal */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Success Alert in Modal */}
                        {success && (
                            <Alert className="border-green-200 bg-green-50/60">
                                <Sparkles className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                <Input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
                                    value={forgotData.email}
                                    onChange={(e) => setForgotData({ email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowForgotModal(false)}
                                className="border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200"
                            >
                                Send Reset Link
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default LoginCustomer;


