import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ToastProvider';
import Landing from './pages/Landing';
import Healthcare from './pages/Healthcare';
import DiagnosticTests from './pages/DiagnosticTests';
import LoginCustomer from './pages/LoginCustomer';
import LoginAdmin from './pages/LoginAdmin';
import LoginSuperadmin from './pages/LoginSuperadmin';
import UserDashboard from './pages/Dashboards/UserDashboard';
import HCSDashboard from './pages/Dashboards/HCSDashboard';
import SuperadminDashboard from './pages/Dashboards/SuperadminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Superadmin pages
import SuperadminUsers from './pages/Dashboards/Superadmin/Users';
import SuperadminHealthcareCenters from './pages/Dashboards/Superadmin/HealthcareCenters';
import SuperadminTests from './pages/Dashboards/Superadmin/Tests';
import SuperadminBookings from './pages/Dashboards/Superadmin/Bookings';
import SuperadminAnalytics from './pages/Dashboards/Superadmin/Analytics';
import SuperadminReviews from './pages/Dashboards/Superadmin/Reviews';
import SuperadminActivityLogs from './pages/Dashboards/Superadmin/ActivityLogs';
import SuperadminMyProfile from './pages/Dashboards/Superadmin/MyProfile';

// HCS pages
import HCSTests from './pages/Dashboards/HCS/Tests';
import HCSBookings from './pages/Dashboards/HCS/Bookings';
import HCSReports from './pages/Dashboards/HCS/Reports';
import HCSMyProfile from './pages/Dashboards/HCS/MyProfile';

// User pages
import UserBookings from './pages/Dashboards/User/Bookings';
import UserNotifications from './pages/Dashboards/User/Notifications';
import UserReviews from './pages/Dashboards/User/Reviews';
import UserMyProfile from './pages/Dashboards/User/MyProfile';

// Layout wrapper component to conditionally show navbar
const LayoutWrapper = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();

    // Define routes where navbar should be shown
    const showNavbarRoutes = [
        '/',
        '/healthcare',
        '/diagnostic-tests',
        '/login-customer'
    ];

    // Show navbar for customer dashboard routes
    const isCustomerRoute = location.pathname.startsWith('/dashboard/user');

    // Don't show navbar for admin/superadmin login and dashboard routes
    const hideNavbarRoutes = [
        '/login-admin',
        '/login-superadmin',
        '/dashboard/superadmin',
        '/dashboard/hcs'
    ];

    const shouldShowNavbar =
        showNavbarRoutes.includes(location.pathname) ||
        isCustomerRoute ||
        (!hideNavbarRoutes.some(route => location.pathname.startsWith(route)) && user?.role === 'Customer');

    // Only show customer login in navbar for public pages
    const showCustomerLoginOnly = !user && !location.pathname.startsWith('/dashboard');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 transition-colors duration-300">
            {shouldShowNavbar && <Navbar showCustomerLoginOnly={showCustomerLoginOnly} />}
            {children}
        </div>
    );
};

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="ewel-ui-theme">
            <AuthProvider>
                <ToastProvider>
                    <Router>
                        <LayoutWrapper>
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/healthcare" element={<Healthcare />} />
                                <Route path="/diagnostic-tests" element={<DiagnosticTests />} />
                                <Route path="/login-customer" element={<LoginCustomer />} />
                                <Route path="/login-admin" element={<LoginAdmin />} />
                                <Route path="/login-superadmin" element={<LoginSuperadmin />} />

                                {/* User Dashboard Routes */}
                                <Route
                                    path="/dashboard/user"
                                    element={
                                        <ProtectedRoute allowedRoles={['Customer']}>
                                            <UserDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/user/bookings"
                                    element={
                                        <ProtectedRoute allowedRoles={['Customer']}>
                                            <UserBookings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/user/notifications"
                                    element={
                                        <ProtectedRoute allowedRoles={['Customer']}>
                                            <UserNotifications />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/user/reviews"
                                    element={
                                        <ProtectedRoute allowedRoles={['Customer']}>
                                            <UserReviews />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/user/profile"
                                    element={
                                        <ProtectedRoute allowedRoles={['Customer']}>
                                            <UserMyProfile />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* HCS Dashboard Routes */}
                                <Route
                                    path="/dashboard/hcs"
                                    element={
                                        <ProtectedRoute allowedRoles={['HCS Admin']}>
                                            <HCSDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/hcs/tests"
                                    element={
                                        <ProtectedRoute allowedRoles={['HCS Admin']}>
                                            <HCSTests />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/hcs/bookings"
                                    element={
                                        <ProtectedRoute allowedRoles={['HCS Admin']}>
                                            <HCSBookings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/hcs/reports"
                                    element={
                                        <ProtectedRoute allowedRoles={['HCS Admin']}>
                                            <HCSReports />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/hcs/profile"
                                    element={
                                        <ProtectedRoute allowedRoles={['HCS Admin']}>
                                            <HCSMyProfile />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Superadmin Dashboard Routes */}
                                <Route
                                    path="/dashboard/superadmin"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/users"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminUsers />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/hcs"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminHealthcareCenters />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/tests"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminTests />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/bookings"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminBookings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/reviews"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminReviews />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/activity-logs"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminActivityLogs />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/reports"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminAnalytics />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/superadmin/profile"
                                    element={
                                        <ProtectedRoute allowedRoles={['Superadmin']}>
                                            <SuperadminMyProfile />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </LayoutWrapper>
                    </Router>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;