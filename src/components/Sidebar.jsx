import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { getProfileImageUrl, getInitials } from '../utils/profileImage';
import {
    Home,
    Calendar,
    FileText,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    Building,
    Crown,
    Bell,
    BarChart3,
    Sparkles,
    MessageSquare,
    Activity,
    Sun,
    Moon
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const getMenuItems = () => {
        switch (user?.role) {
            case 'Customer':
                return [
                    { name: 'Dashboard', href: '/dashboard/user', icon: Home, color: 'from-blue-500 to-blue-600' },
                    { name: 'My Bookings', href: '/dashboard/user/bookings', icon: Calendar, color: 'from-blue-600 to-indigo-600' },
                    { name: 'Notifications', href: '/dashboard/user/notifications', icon: Bell, color: 'from-indigo-500 to-blue-600' },
                    { name: 'Reviews', href: '/dashboard/user/reviews', icon: MessageSquare, color: 'from-blue-700 to-indigo-700' },
                    { name: 'My Profile', href: '/dashboard/user/profile', icon: User, color: 'from-indigo-600 to-blue-700' },
                ];
            case 'HCS Admin':
                return [
                    { name: 'Dashboard', href: '/dashboard/hcs', icon: Home, color: 'from-blue-500 to-blue-600' },
                    { name: 'Tests', href: '/dashboard/hcs/tests', icon: FileText, color: 'from-blue-600 to-indigo-600' },
                    { name: 'Bookings', href: '/dashboard/hcs/bookings', icon: Calendar, color: 'from-indigo-500 to-blue-600' },
                    { name: 'Reports', href: '/dashboard/hcs/reports', icon: BarChart3, color: 'from-blue-700 to-indigo-700' },
                    { name: 'My Profile', href: '/dashboard/hcs/profile', icon: User, color: 'from-indigo-600 to-blue-700' },
                ];
            case 'Superadmin':
                return [
                    { name: 'Dashboard', href: '/dashboard/superadmin', icon: Home, color: 'from-blue-500 to-blue-600' },
                    { name: 'Users', href: '/dashboard/superadmin/users', icon: Users, color: 'from-blue-600 to-indigo-600' },
                    { name: 'Tests', href: '/dashboard/superadmin/tests', icon: FileText, color: 'from-indigo-500 to-blue-600' },
                    { name: 'Healthcare Centers', href: '/dashboard/superadmin/hcs', icon: Building, color: 'from-blue-700 to-indigo-700' },
                    { name: 'Bookings', href: '/dashboard/superadmin/bookings', icon: Calendar, color: 'from-indigo-600 to-blue-700' },
                    { name: 'Reviews', href: '/dashboard/superadmin/reviews', icon: MessageSquare, color: 'from-blue-800 to-indigo-800' },
                    { name: 'Activity Logs', href: '/dashboard/superadmin/activity-logs', icon: Activity, color: 'from-indigo-700 to-blue-800' },
                    { name: 'Reports', href: '/dashboard/superadmin/reports', icon: BarChart3, color: 'from-blue-900 to-indigo-900' },
                    { name: 'My Profile', href: '/dashboard/superadmin/profile', icon: User, color: 'from-indigo-800 to-blue-900' },
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    const handleLogout = () => {
        logout();
        // Redirect based on user role
        if (user?.role === 'Superadmin') {
            navigate('/login-superadmin');
        } else if (user?.role === 'HCS Admin') {
            navigate('/login-admin');
        } else {
            navigate('/');
        }
    };

    const getRoleIcon = () => {
        switch (user?.role) {
            case 'Customer':
                return <User className="h-5 w-5" />;
            case 'HCS Admin':
                return <Building className="h-5 w-5" />;
            case 'Superadmin':
                return <Crown className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
        }
    };

    const getRoleGradient = () => {
        switch (user?.role) {
            case 'Customer':
                return 'from-blue-500 to-indigo-600';
            case 'HCS Admin':
                return 'from-blue-600 to-indigo-700';
            case 'Superadmin':
                return 'from-indigo-600 to-blue-700';
            default:
                return 'from-blue-500 to-blue-600';
        }
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-modern border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-modern-lg border-r border-gray-100 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                {user?.profilePhoto && (
                                    <AvatarImage
                                        src={getProfileImageUrl(user.profilePhoto)}
                                        alt={user.name}
                                    />
                                )}
                                <AvatarFallback className={`bg-gradient-to-r ${getRoleGradient()} text-white font-semibold`}>
                                    {getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 font-poppins">
                                        {user?.name}
                                    </h2>
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                </div>
                                <Badge variant="default" className={`bg-gradient-to-r ${getRoleGradient()} border-0 text-white`}>
                                    {getRoleIcon()}
                                    <span className="ml-2">{user?.role}</span>
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
                    ${isActive
                                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                                            : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100 hover:scale-105'
                                        }
                  `}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className={`p-2 rounded-lg transition-all duration-300 ${isActive
                                        ? 'bg-white/20'
                                        : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                                        }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute right-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Theme Toggle */}
                        <Separator className="my-4" />
                        <Button
                            variant="ghost"
                            onClick={toggleTheme}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100 w-full justify-start"
                        >
                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 transition-colors">
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </div>
                            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </Button>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    {user?.profilePhoto && (
                                        <AvatarImage
                                            src={getProfileImageUrl(user.profilePhoto)}
                                            alt={user.name}
                                        />
                                    )}
                                    <AvatarFallback className={`bg-gradient-to-r ${getRoleGradient()} text-white font-semibold text-sm`}>
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs font-medium text-gray-900 dark:text-slate-100">{user?.email}</p>
                                    <Badge variant="success" className="text-xs mt-1">
                                        Active now
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <Button
                            variant="outline"
                            className="w-full justify-start hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;


