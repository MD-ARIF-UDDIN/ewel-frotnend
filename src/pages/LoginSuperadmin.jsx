import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, Lock, Eye, EyeOff, Crown, AlertCircle } from 'lucide-react';

const LoginSuperadmin = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const result = await login(loginData.email, loginData.password);

        if (result.success) {
            if (result.user.role === 'Superadmin') {
                setSuccess('Login successful! Redirecting to superadmin dashboard...');
                setTimeout(() => navigate('/dashboard/superadmin'), 1000);
            } else {
                setError('Access denied. Superadmin privileges required.');
            }
        } else {
            setError(result.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300 pt-20">
            <Card className="w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-white/30 dark:border-slate-700/50 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full w-fit">
                        <Crown className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl">Superadmin Portal</CardTitle>
                    <CardDescription>
                        Sign in to access the superadmin dashboard
                    </CardDescription>

                    {/* Error Alert */}
                    {error && (
                        <Alert className="mt-4" variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <Alert className="mt-4" variant="default">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your superadmin email"
                                    className="pl-10 bg-white/10 backdrop-blur-md border-white/20"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10 bg-white/10 backdrop-blur-md border-white/20"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                                Superadmin access only. Highest level privileges required.
                            </p>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t">
                        <div className="text-center space-y-2">
                            <Link to="/" className="text-sm text-gray-600 dark:text-slate-300 hover:underline block">
                                Back to Home
                            </Link>
                            <Link to="/login-customer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline block">
                                Customer Login
                            </Link>
                            <Link to="/login-admin" className="text-sm text-blue-600 dark:text-blue-400 hover:underline block">
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginSuperadmin;


