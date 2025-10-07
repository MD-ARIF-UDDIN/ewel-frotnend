import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Separator } from '../../../components/ui/separator';
import { Modal, ModalContent } from '../../../components/ui/modal';
import Sidebar from '../../../components/Sidebar';
import StatsCard from '../../../components/StatsCard';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';
import {
    Star,
    MessageSquare,
    Users,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Filter,
    Search,
    Calendar,
    User
} from 'lucide-react';

const SuperadminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        statusDistribution: { pending: 0, approved: 0, rejected: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        rating: '',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
    });
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalReviews: 0,
        hasNext: false,
        hasPrev: false
    });

    const { toast } = useToast();

    useEffect(() => {
        fetchReviews();
    }, [filters]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    queryParams.append(key, filters[key]);
                }
            });

            const response = await api.get(`/reviews?${queryParams.toString()}`);
            setReviews(response.data.data);
            setStats(response.data.stats);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (reviewId, status, adminResponse = '') => {
        try {
            await api.put(`/reviews/${reviewId}`, {
                status,
                adminResponse
            });

            // Show success message with toast
            toast.success('Success', `Review ${status} successfully`);

            // Refresh reviews
            fetchReviews();

            if (selectedReview && selectedReview._id === reviewId) {
                setSelectedReview(null);
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating review status:', error);
            toast.error('Error', 'Failed to update review status: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleViewReview = (review) => {
        setSelectedReview(review);
        setShowModal(true);
    };

    const renderStars = (rating, showNumber = true) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating
                            ? 'text-indigo-400 fill-current'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
                {showNumber && (
                    <span className="text-sm text-gray-600 ml-2">({rating})</span>
                )}
            </div>
        );
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: { variant: 'warning', icon: Clock },
            approved: { variant: 'success', icon: CheckCircle },
            rejected: { variant: 'destructive', icon: XCircle }
        };

        const { variant, icon: Icon } = variants[status] || variants.pending;

        return (
            <Badge variant={variant} className="flex items-center space-x-1">
                <Icon className="h-3 w-3" />
                <span className="capitalize">{status}</span>
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase() || 'U';
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
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Customer Reviews</h1>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">Monitor and manage customer feedback</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Reviews"
                            value={stats.totalReviews}
                            icon={MessageSquare}
                            className="bg-blue-50 dark:bg-slate-800"
                        />
                        <StatsCard
                            title="Average Rating"
                            value={stats.averageRating.toFixed(1)}
                            icon={Star}
                            className="bg-blue-50 dark:bg-slate-800"
                        />
                        <StatsCard
                            title="Pending Reviews"
                            value={stats.statusDistribution.pending}
                            icon={Clock}
                            className="bg-blue-50 dark:bg-slate-800"
                        />
                        <StatsCard
                            title="Approved Reviews"
                            value={stats.statusDistribution.approved}
                            icon={CheckCircle}
                            className="bg-green-50 dark:bg-slate-800"
                        />
                    </div>

                    {/* Rating Distribution */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Rating Distribution</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">Breakdown of customer ratings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2 w-20">
                                            <span className="text-sm font-medium">{rating}</span>
                                            <Star className="h-4 w-4 text-indigo-400 fill-current" />
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 w-12">
                                            {stats.ratingDistribution[rating]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-4">
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <select
                                    value={filters.rating}
                                    onChange={(e) => setFilters({ ...filters, rating: e.target.value, page: 1 })}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>

                                <select
                                    value={`${filters.sortBy}_${filters.order}`}
                                    onChange={(e) => {
                                        const [sortBy, order] = e.target.value.split('_');
                                        setFilters({ ...filters, sortBy, order, page: 1 });
                                    }}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                >
                                    <option value="createdAt_desc">Newest First</option>
                                    <option value="createdAt_asc">Oldest First</option>
                                    <option value="rating_desc">Highest Rating</option>
                                    <option value="rating_asc">Lowest Rating</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <MessageSquare className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No reviews found</h3>
                                    <p className="text-slate-500 dark:text-slate-400">No customer reviews match your current filters.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            reviews.map((review) => (
                                <Card key={review._id} className="hover:shadow-lg transition-shadow duration-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">
                                                    {getInitials(review.user?.name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{review.user?.name || 'Anonymous'}</h3>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{review.user?.email || 'No email provided'}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        {getStatusBadge(review.status)}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewReview(review)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    {renderStars(review.rating)}
                                                </div>

                                                <p className="text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">
                                                    {review.review || 'No written review provided'}
                                                </p>

                                                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center space-x-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(review.createdAt)}</span>
                                                    </span>
                                                    {review.reviewedBy && (
                                                        <span className="flex items-center space-x-1">
                                                            <User className="h-4 w-4" />
                                                            <span>Reviewed by {review.reviewedBy?.name || 'Unknown'}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
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
                                Page {filters.page} of {pagination.totalPages}
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

            {/* Review Detail Modal */}
            {showModal && selectedReview && (
                <Modal open={showModal} onOpenChange={setShowModal}>
                    <ModalContent className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50 rounded-xl">
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                                        {getInitials(selectedReview.user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedReview.user?.name || 'Anonymous'}</h2>
                                    <p className="text-slate-600 dark:text-slate-400">{selectedReview.user?.email || 'No email provided'}</p>
                                    {renderStars(selectedReview.rating)}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Review</h3>
                                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                                    {selectedReview.review || 'No written review provided - rating only'}
                                </p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Status:</span>
                                    {getStatusBadge(selectedReview.status)}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    <p>Submitted: {formatDate(selectedReview.createdAt)}</p>
                                    {selectedReview.reviewedBy && (
                                        <p>Reviewed by: {selectedReview.reviewedBy?.name || 'Unknown'} on {formatDate(selectedReview.reviewedAt)}</p>
                                    )}
                                </div>
                            </div>

                            {selectedReview.adminResponse && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Admin Response</h3>
                                    <p className="text-slate-700 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        {selectedReview.adminResponse}
                                    </p>
                                </div>
                            )}

                            <div className="flex space-x-3">
                                {selectedReview.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => handleStatusUpdate(selectedReview._id, 'approved')}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleStatusUpdate(selectedReview._id, 'rejected')}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                                <Button variant="outline" onClick={() => setShowModal(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};

export default SuperadminReviews;