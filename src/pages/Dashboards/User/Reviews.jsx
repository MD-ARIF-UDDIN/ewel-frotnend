import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import Sidebar from '../../../components/Sidebar';
import api from '../../../api/axios';
import { useToast } from '../../../components/ToastProvider';
import {
    Star,
    MessageSquare,
    Send,
    Edit,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

const UserReviews = () => {
    const [existingReview, setExistingReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        review: ''
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchExistingReview();
    }, []);

    const fetchExistingReview = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews/my-review');
            setExistingReview(response.data.data);
            setFormData({
                rating: response.data.data.rating,
                review: response.data.data.review
            });
        } catch (error) {
            // No existing review found - this is expected for new users
            if (error.response?.status !== 404) {
                console.error('Error fetching review:', error);
            }
            setExistingReview(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Only rating is required, review text is optional

        try {
            setSubmitting(true);

            if (existingReview) {
                // Update existing review
                await api.put(`/reviews/${existingReview._id}`, formData);
                showToast('Review updated successfully!', 'success');
            } else {
                // Create new review
                await api.post('/reviews', formData);
                showToast('Review submitted successfully!', 'success');
            }

            setIsEditing(false);
            fetchExistingReview(); // Refresh the review
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast(
                error.response?.data?.message || 'Failed to submit review',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleRatingClick = (rating) => {
        setFormData({ ...formData, rating });
    };

    const renderStars = (rating, interactive = false, size = 'h-6 w-6') => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} transition-colors duration-200 ${star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
                        onClick={interactive ? () => handleRatingClick(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: {
                variant: 'warning',
                icon: Clock,
                text: 'Under Review',
                description: 'Your review is being reviewed by our team'
            },
            approved: {
                variant: 'success',
                icon: CheckCircle,
                text: 'Approved',
                description: 'Your review has been approved and is visible'
            },
            rejected: {
                variant: 'destructive',
                icon: XCircle,
                text: 'Rejected',
                description: 'Your review was rejected. You can edit and resubmit it.'
            }
        };

        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <div className="flex items-center space-x-2">
                <Badge variant={config.variant} className="flex items-center space-x-1">
                    <Icon className="h-3 w-3" />
                    <span>{config.text}</span>
                </Badge>
                <span className="text-sm text-gray-500 dark:text-slate-400">{config.description}</span>
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            <Sidebar />

            <div className="flex-1 lg:ml-72">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                                {existingReview ? 'My Review' : 'Submit Review'}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-slate-300">
                            {existingReview
                                ? 'View and manage your submitted review'
                                : 'Share your experience with our healthcare services'
                            }
                        </p>
                    </div>

                    {/* Existing Review Display */}
                    {existingReview && !isEditing && (
                        <Card className="mb-6">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Your Review</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Review
                                    </Button>
                                </div>
                                <CardDescription>
                                    Submitted on {formatDate(existingReview.createdAt)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Rating</h4>
                                        {renderStars(existingReview.rating)}
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Review</h4>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                            {existingReview.review || 'No written review provided - rating only'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                                        {getStatusBadge(existingReview.status)}
                                    </div>

                                    {existingReview.adminResponse && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Admin Response</h4>
                                            <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                                {existingReview.adminResponse}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Review Form */}
                    {(!existingReview || isEditing) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {existingReview ? 'Edit Your Review' : 'Submit Your Review'}
                                </CardTitle>
                                <CardDescription>
                                    {existingReview
                                        ? 'Update your rating and feedback'
                                        : 'Help us improve our services by sharing your experience'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Overall Rating *
                                        </label>
                                        {renderStars(formData.rating, true, 'h-8 w-8')}
                                        <p className="text-sm text-gray-500 mt-2">
                                            Click on stars to rate (1 = Poor, 5 = Excellent)
                                        </p>
                                    </div>

                                    {/* Review Text */}
                                    <div>
                                        <label
                                            htmlFor="review"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Your Review (Optional)
                                        </label>
                                        <textarea
                                            id="review"
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Please share your experience with our healthcare services. What went well? What could be improved? (Optional)"
                                            value={formData.review}
                                            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                            maxLength={1000}
                                        />
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-sm text-gray-500">
                                                Review text is optional - rating is sufficient
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formData.review.length}/1000
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex space-x-3">
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            {submitting ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            ) : (
                                                <Send className="h-4 w-4 mr-2" />
                                            )}
                                            {submitting
                                                ? 'Submitting...'
                                                : existingReview
                                                    ? 'Update Review'
                                                    : 'Submit Review'
                                            }
                                        </Button>

                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        rating: existingReview.rating,
                                                        review: existingReview.review
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Help Section */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-blue-600" />
                                <span>Review Guidelines</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Only star rating is required - written review is optional</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Be honest and specific about your experience if you choose to write a review</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Focus on the service quality and your overall experience</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Keep your review professional and constructive</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>All reviews are moderated before being published</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>You can edit your review anytime after submission</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserReviews;