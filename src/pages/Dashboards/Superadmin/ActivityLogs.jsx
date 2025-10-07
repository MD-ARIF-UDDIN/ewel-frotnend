import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Separator } from '../../../components/ui/separator';
import { Modal, ModalContent } from '../../../components/ui/modal';
import Sidebar from '../../../components/Sidebar';
import StatsCard from '../../../components/StatsCard';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';
import {
    Activity,
    Users,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Filter,
    Download,
    Search,
    Calendar,
    User,
    Shield,
    Trash2,
    BarChart3,
    Globe,
    Smartphone,
    Monitor
} from 'lucide-react';

const SuperadminActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        totalActivities: 0,
        successfulActivities: 0,
        failedActivities: 0,
        uniqueUsersCount: 0,
        actionDistribution: {},
        resourceDistribution: {},
        severityDistribution: {}
    });
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [filters, setFilters] = useState({
        userId: '',
        action: '',
        resource: '',
        success: '',
        severity: '',
        startDate: '',
        endDate: '',
        search: '',
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        order: 'desc'
    });
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalLogs: 0,
        hasNext: false,
        hasPrev: false
    });

    const { toast } = useToast();

    // Filter options
    const actionOptions = [
        'LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_RESET', 'PASSWORD_CHANGE',
        'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_VIEW',
        'BOOKING_CREATE', 'BOOKING_UPDATE', 'BOOKING_DELETE', 'BOOKING_VIEW', 'BOOKING_STATUS_CHANGE',
        'HCS_CREATE', 'HCS_UPDATE', 'HCS_DELETE', 'HCS_VIEW',
        'TEST_CREATE', 'TEST_UPDATE', 'TEST_DELETE', 'TEST_VIEW',
        'REVIEW_CREATE', 'REVIEW_UPDATE', 'REVIEW_DELETE', 'REVIEW_VIEW', 'REVIEW_STATUS_CHANGE',
        'DASHBOARD_VIEW', 'PROFILE_VIEW', 'PROFILE_UPDATE', 'REPORT_VIEW', 'REPORT_EXPORT'
    ];

    const resourceOptions = [
        'USER', 'BOOKING', 'HEALTHCARE_CENTER', 'TEST', 'REVIEW',
        'DASHBOARD', 'PROFILE', 'REPORT', 'AUTH', 'SYSTEM'
    ];

    const severityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    useEffect(() => {
        fetchActivityLogs();
    }, [filters]);

    const fetchActivityLogs = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await api.get(`/activity-logs?${queryParams.toString()}`);
            setLogs(response.data.data);
            setStats(response.data.stats);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewLog = (log) => {
        setSelectedLog(log);
        setShowModal(true);
    };

    const handleExport = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const response = await api.get(`/activity-logs/export?${queryParams.toString()}`);

            // Convert to CSV and download
            const csvContent = convertToCSV(response.data.data);
            downloadCSV(csvContent, 'activity_logs.csv');
        } catch (error) {
            console.error('Error exporting logs:', error);
        }
    };

    const handleClearLogs = () => {
        setShowClearConfirm(true);
    };

    const confirmClearLogs = async () => {
        try {
            setLoading(true);
            setShowClearConfirm(false);

            const response = await api.delete('/activity-logs');

            // Refresh the logs and stats
            await fetchActivityLogs();

            // Show success message with toast instead of alert
            toast.success('Success', `Successfully deleted ${response.data.deletedCount} activity logs`);
        } catch (error) {
            console.error('Error clearing logs:', error);
            toast.error('Error', 'Error clearing logs: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const convertToCSV = (data) => {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header =>
                    JSON.stringify(row[header] || '')
                ).join(',')
            )
        ].join('\n');

        return csv;
    };

    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetFilters = () => {
        setFilters({
            userId: '',
            action: '',
            resource: '',
            success: '',
            severity: '',
            startDate: '',
            endDate: '',
            search: '',
            page: 1,
            limit: 50,
            sortBy: 'createdAt',
            order: 'desc'
        });
    };

    const getSeverityBadge = (severity) => {
        const variants = {
            LOW: { variant: 'default', color: 'bg-gray-100 text-gray-800' },
            MEDIUM: { variant: 'warning', color: 'bg-blue-100 text-blue-800' },
            HIGH: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
            CRITICAL: { variant: 'destructive', color: 'bg-red-100 text-red-800' }
        };

        const config = variants[severity] || variants.LOW;

        return (
            <Badge className={config.color}>
                {severity}
            </Badge>
        );
    };

    const getActionIcon = (action) => {
        if (action.includes('LOGIN') || action.includes('LOGOUT')) return Shield;
        if (action.includes('CREATE')) return CheckCircle;
        if (action.includes('UPDATE')) return Activity;
        if (action.includes('DELETE')) return XCircle;
        if (action.includes('VIEW')) return Eye;
        return Activity;
    };

    const getDeviceIcon = (userAgent) => {
        return Monitor;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase() || 'U';
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        if (duration < 1000) return `${duration}ms`;
        return `${(duration / 1000).toFixed(2)}s`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Sidebar />

            <div className="flex-1 lg:ml-72">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Activity Logs</h1>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">Monitor all user activities and system events</p>
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    onClick={handleExport}
                                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                                <Button
                                    onClick={() => setShowClearConfirm(true)}
                                    variant="destructive"
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear Log Data
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Activities"
                            value={stats.totalActivities}
                            icon={Activity}
                            className="bg-blue-50 dark:bg-slate-800"
                        />
                        <StatsCard
                            title="Successful Actions"
                            value={stats.successfulActivities}
                            icon={CheckCircle}
                            className="bg-green-50 dark:bg-slate-800"
                        />
                        <StatsCard
                            title="Failed Actions"
                            value={stats.failedActivities}
                            icon={XCircle}
                            className="bg-red-50 dark:bg-slate-800"
                        />
                        <StatsCard
                            title="Active Users"
                            value={stats.uniqueUsersCount}
                            icon={Users}
                            className="bg-indigo-50 dark:bg-slate-800"
                        />
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <Filter className="h-5 w-5" />
                                    <span>Filters</span>
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)}>
                                    Clear All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Action
                                    </label>
                                    <select
                                        value={filters.action}
                                        onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">All Actions</option>
                                        {actionOptions.map(action => (
                                            <option key={action} value={action}>{action}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Resource
                                    </label>
                                    <select
                                        value={filters.resource}
                                        onChange={(e) => setFilters({ ...filters, resource: e.target.value, page: 1 })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">All Resources</option>
                                        {resourceOptions.map(resource => (
                                            <option key={resource} value={resource}>{resource}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={filters.success}
                                        onChange={(e) => setFilters({ ...filters, success: e.target.value, page: 1 })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">All Status</option>
                                        <option value="true">Success</option>
                                        <option value="false">Failed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Severity
                                    </label>
                                    <select
                                        value={filters.severity}
                                        onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="">All Severities</option>
                                        {severityOptions.map(severity => (
                                            <option key={severity} value={severity}>{severity}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                                        className="glass-input w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                                        className="glass-input w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Search Description
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Search in activity descriptions..."
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                            className="glass-input w-full pl-10 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Logs List */}
                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Activity className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No activity logs found</h3>
                                    <p className="text-slate-500 dark:text-slate-400">No activities match your current filters.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            logs.map((log) => {
                                const ActionIcon = getActionIcon(log.action);
                                // Removed DeviceIcon since userAgent is not stored

                                return (
                                    <Card key={log._id} className="hover:shadow-lg transition-shadow duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <div className={`p-2 rounded-lg ${log.success ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    <ActionIcon className={`h-5 w-5 ${log.success ? 'text-green-600' : 'text-red-600'}`} />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-3">
                                                            {log.user && (
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                                                                        {getInitials(log.user.name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                            <div>
                                                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                                                    {log.user ? log.user.name : 'System'}
                                                                </h3>
                                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                    {log.user ? log.user.role : 'System'} • {log.action} • {log.resource}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            {getSeverityBadge(log.severity)}
                                                            <Badge variant={log.success ? 'success' : 'destructive'}>
                                                                {log.success ? 'Success' : 'Failed'}
                                                            </Badge>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewLog(log)}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-700 dark:text-slate-300 mb-3">
                                                        {log.description}
                                                    </p>

                                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                                        <div className="flex items-center space-x-4">
                                                            <span className="flex items-center space-x-1">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{formatDate(log.createdAt)}</span>
                                                            </span>
                                                            {/* Removed ipAddress display since it's not stored */}
                                                            {/* Removed device icon display since userAgent is not stored */}
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <span className="flex items-center space-x-1">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{formatDuration(log.duration)}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 mt-8">
                            <Button
                                variant="outline"
                                disabled={!pagination.hasPrev}
                                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                            >
                                Previous
                            </Button>

                            <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
                                Page {filters.page} of {pagination.totalPages} ({pagination.totalLogs} total)
                            </span>

                            <Button
                                variant="outline"
                                disabled={!pagination.hasNext}
                                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Log Detail Modal */}
            {selectedLog && (
                <Modal open={showModal} onOpenChange={setShowModal}>
                    <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                        <div className="p-6 max-w-2xl">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className={`p-3 rounded-lg ${selectedLog.success ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <Activity className={`h-6 w-6 ${selectedLog.success ? 'text-green-600' : 'text-red-600'}`} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Activity Details</h2>
                                    <p className="text-slate-600 dark:text-slate-400">{selectedLog.action} - {selectedLog.resource}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">User</h3>
                                        <p className="text-slate-700 dark:text-slate-300">{selectedLog.user ? selectedLog.user.name : 'System'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Role</h3>
                                        <p className="text-slate-700 dark:text-slate-300">{selectedLog.user ? selectedLog.user.role : 'System'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Status</h3>
                                        <Badge variant={selectedLog.success ? 'success' : 'destructive'}>
                                            {selectedLog.success ? 'Success' : 'Failed'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Severity</h3>
                                        {getSeverityBadge(selectedLog.severity)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Timestamp</h3>
                                        <p className="text-slate-700 dark:text-slate-300">{formatDate(selectedLog.createdAt)}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Duration</h3>
                                        <p className="text-slate-700 dark:text-slate-300">{formatDuration(selectedLog.duration)}</p>
                                    </div>
                                    {/* Removed ipAddress field since it's not stored */}
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Resource ID</h3>
                                        <p className="text-slate-700 dark:text-slate-300 font-mono text-sm">{selectedLog.resourceId || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Description</h3>
                                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                                        {selectedLog.description}
                                    </p>
                                </div>

                                {selectedLog.errorMessage && (
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Error Message</h3>
                                        <p className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-400 dark:border-red-500">
                                            {selectedLog.errorMessage}
                                        </p>
                                    </div>
                                )}

                                {/* Removed userAgent field since it's not stored */}

                                {/* Removed metadata field since it's not stored */}
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button variant="outline" onClick={() => setShowModal(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}

            {/* Clear Logs Confirmation Modal */}
            {showClearConfirm && (
                <Modal open={showClearConfirm} onOpenChange={setShowClearConfirm}>
                    <ModalContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                        <div className="p-6 max-w-md w-full">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-center text-slate-900 dark:text-slate-100 mb-2">
                                Clear All Activity Logs
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
                                Are you sure you want to delete all activity logs? This action cannot be undone and all logs will be permanently removed.
                            </p>
                            <div className="flex justify-center space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowClearConfirm(false)}
                                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmClearLogs}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Clear All Logs
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};

export default SuperadminActivityLogs;