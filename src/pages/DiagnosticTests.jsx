import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, Clock, MapPin, Filter, Search, Star, Stethoscope, Microscope, Heart, Activity, Eye, CheckCircle, User, DollarSign, Timer, ChevronRight, Award, Zap } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import api from '../api/axios';

const DiagnosticTests = () => {
    const [tests, setTests] = useState([]);
    const [hcs, setHcs] = useState([]);
    const [filteredTests, setFilteredTests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [hcsFilter, setHcsFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [loading, setLoading] = useState(true);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [availableSlots, setAvailableSlots] = useState(null);
    // New state for selected HCS in booking modal
    const [selectedHCS, setSelectedHCS] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleBookTest = async (test) => {
        setSelectedTest(test);
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // 9:00 AM
        setSelectedDateTime(tomorrow.toISOString().slice(0, 16));
        // Get user's current phone number
        try {
            const response = await api.get('/auth/me');
            setPhoneNumber(response.data.data.phone || '');
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        // Reset selected HCS
        setSelectedHCS('');
        setBookingModalOpen(true);
    };

    const checkAvailableSlots = async (date) => {
        if (!selectedHCS || selectedHCS === '') return;

        try {
            const response = await api.get(`/hcs/${selectedHCS}/availability?date=${date}`);
            setAvailableSlots(response.data.data);
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailableSlots(null);
        }
    };

    const confirmBooking = async () => {
        try {
            // Validate phone number
            if (!phoneNumber) {
                toast.error('Error', 'Please enter your phone number');
                return;
            }

            // Validate that a HCS is selected
            if (!selectedHCS || selectedHCS === '') {
                toast.error('Error', 'Please select a healthcare center before booking');
                return;
            }

            // Validate that a date/time is selected
            if (!selectedDateTime) {
                toast.error('Error', 'Please select a date and time for your appointment');
                return;
            }

            // Validate that selected date is in the future
            const selectedDate = new Date(selectedDateTime);
            const now = new Date();
            if (selectedDate <= now) {
                toast.error('Error', 'Please select a future date and time for your appointment');
                return;
            }

            // Ensure the date is in ISO format for the backend
            const isoScheduledAt = new Date(selectedDateTime).toISOString();

            const response = await api.post('/bookings', {
                test: selectedTest._id,
                hcs: selectedHCS,
                scheduledAt: isoScheduledAt,
                phone: phoneNumber
            });

            if (response.data.success) {
                toast.success('Success', 'Booking created successfully!');
                setBookingModalOpen(false);
                setSelectedTest(null);
                setSelectedDateTime('');
                setPhoneNumber('');
                setSelectedHCS('');
                setAvailableSlots(null);
            } else {
                toast.error('Error', response.data.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking';
            toast.error('Error', errorMessage);
        }
    };

    useEffect(() => {
        fetchTests();
        fetchHCS();
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tests');
            setTests(response.data.data);
            setFilteredTests(response.data.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHCS = async () => {
        try {
            const response = await api.get('/hcs');
            setHcs(response.data.data);
        } catch (error) {
            console.error('Error fetching HCS:', error);
        }
    };

    useEffect(() => {
        let result = tests;

        // Apply search filter
        if (searchTerm) {
            result = result.filter(test =>
                test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                test.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (typeFilter && typeFilter !== 'all') {
            result = result.filter(test => test.type === typeFilter);
        }

        // Apply HCS filter
        if (hcsFilter && hcsFilter !== 'all') {
            result = result.filter(test =>
                test.hcsPricing.some(pricing =>
                    pricing.hcs._id === hcsFilter && pricing.status === 'approved'
                )
            );
        }

        // Apply sorting
        result = [...result].sort((a, b) => {
            // Get price for selected HCS or use base price
            let priceA = a.price;
            let priceB = b.price;

            if (hcsFilter && hcsFilter !== 'all') {
                const pricingA = a.hcsPricing.find(pricing => pricing.hcs._id === hcsFilter);
                const pricingB = b.hcsPricing.find(pricing => pricing.hcs._id === hcsFilter);
                if (pricingA) priceA = pricingA.price;
                if (pricingB) priceB = pricingB.price;
            }

            switch (sortBy) {
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'duration':
                    return a.duration - b.duration;
                default:
                    return 0;
            }
        });

        setFilteredTests(result);
    }, [searchTerm, typeFilter, hcsFilter, sortBy, tests]);

    // Check availability when date or HCS changes
    useEffect(() => {
        if (selectedDateTime && selectedHCS && selectedTest) {
            const date = selectedDateTime.split('T')[0]; // Extract date part
            checkAvailableSlots(date);
        }
    }, [selectedDateTime, selectedHCS, selectedTest]);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Blood Test': return <Activity className="h-5 w-5" />;
            case 'X-Ray': return <Eye className="h-5 w-5" />;
            case 'MRI': return <Activity className="h-5 w-5" />;
            case 'CT Scan': return <Activity className="h-5 w-5" />;
            case 'Ultrasound': return <Activity className="h-5 w-5" />;
            case 'ECG': return <Heart className="h-5 w-5" />;
            default: return <Microscope className="h-5 w-5" />;
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    // Get price for a test based on selected HCS
    const getTestPrice = (test) => {
        if (hcsFilter && hcsFilter !== 'all') {
            const pricing = test.hcsPricing.find(pricing => pricing.hcs._id === hcsFilter);
            if (pricing) return pricing.price;
        }
        return test.price;
    };

    // Get all approved HCS names for a test
    const getApprovedHCSNames = (test) => {
        return test.hcsPricing
            .filter(pricing => pricing.status === 'approved')
            .map(pricing => {
                // Handle both string and object formats for HCS reference
                const hcsId = typeof pricing.hcs === 'string' ? pricing.hcs : pricing.hcs._id;
                // Find the HCS in our HCS array
                const hcsData = hcs.find(h => h._id === hcsId);
                return hcsData ? hcsData.name : null;
            })
            .filter(name => name); // Remove null/undefined names
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                            <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-4">
                            Diagnostic Tests
                        </h1>
                    </div>
                </div>

                {/* Enhanced Filters Section */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-10 border border-white/50 dark:border-slate-700/70">
                    <div className="flex items-center mb-8">
                        <Filter className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Your Test</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-gray-700 dark:text-slate-300 flex items-center font-medium">
                                <Search className="h-5 w-5 mr-2" />
                                Search
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Search tests..."
                                    className="pl-12 w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type-filter" className="text-gray-700 dark:text-slate-300 flex items-center font-medium">
                                <Microscope className="h-5 w-5 mr-2" />
                                Test Type
                            </Label>
                            <Select
                                id="type-filter"
                                value={typeFilter}
                                onValueChange={(value) => setTypeFilter(value)}
                            >
                                <SelectTrigger className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm transition-all">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Blood Test">Blood Test</SelectItem>
                                    <SelectItem value="X-Ray">X-Ray</SelectItem>
                                    <SelectItem value="MRI">MRI</SelectItem>
                                    <SelectItem value="CT Scan">CT Scan</SelectItem>
                                    <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                                    <SelectItem value="ECG">ECG</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hcs-filter" className="text-gray-700 dark:text-slate-300 flex items-center font-medium">
                                <MapPin className="h-5 w-5 mr-2" />
                                Center
                            </Label>
                            <Select
                                id="hcs-filter"
                                value={hcsFilter}
                                onValueChange={(value) => {
                                    setHcsFilter(value);
                                    // Reset date when HCS changes
                                    setSelectedDateTime('');
                                    setAvailableSlots(null);
                                }}
                            >
                                <SelectTrigger className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm transition-all">
                                    <SelectValue placeholder="All Centers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Centers</SelectItem>
                                    {hcs.map(center => (
                                        <SelectItem key={center._id} value={center._id}>{center.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort-by" className="text-gray-700 dark:text-slate-300 flex items-center font-medium">
                                <Activity className="h-5 w-5 mr-2" />
                                Sort By
                            </Label>
                            <Select
                                id="sort-by"
                                value={sortBy}
                                onValueChange={(value) => setSortBy(value)}
                            >
                                <SelectTrigger className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm transition-all">
                                    <SelectValue placeholder="Name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                                    <SelectItem value="duration">Duration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Test Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTests.map((test) => {
                        // Get approved HCS names for this test
                        const approvedHCSNames = getApprovedHCSNames(test);
                        const testType = test.type;

                        // Get icon and color based on test type
                        const getTestTypeInfo = (type) => {
                            switch (type) {
                                case 'Blood Test': return { icon: <Activity className="h-6 w-6" />, color: 'from-red-500 to-orange-500' };
                                case 'X-Ray': return { icon: <Eye className="h-6 w-6" />, color: 'from-blue-500 to-cyan-500' };
                                case 'MRI': return { icon: <Activity className="h-6 w-6" />, color: 'from-purple-500 to-indigo-500' };
                                case 'CT Scan': return { icon: <Activity className="h-6 w-6" />, color: 'from-green-500 to-teal-500' };
                                case 'Ultrasound': return { icon: <Activity className="h-6 w-6" />, color: 'from-pink-500 to-rose-500' };
                                case 'ECG': return { icon: <Heart className="h-6 w-6" />, color: 'from-yellow-500 to-amber-500' };
                                default: return { icon: <Microscope className="h-6 w-6" />, color: 'from-gray-500 to-slate-500' };
                            }
                        };

                        const { icon, color } = getTestTypeInfo(testType);

                        return (
                            <div key={test._id} className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-slate-700">
                                {/* Header with gradient and icon */}
                                <div className={`bg-gradient-to-r ${color} p-6 relative`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                                {icon}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-xl font-bold text-white">{test.title}</h3>
                                                <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-0 text-xs font-medium">
                                                    {testType}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                                        {test.description}
                                    </p>

                                    <div className="space-y-4 mb-6">
                                        {/* Price and Duration in a single row */}
                                        <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl">
                                                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs text-gray-500 dark:text-slate-400">Price</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">${getTestPrice(test)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-xl">
                                                    <Timer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-xs text-gray-500 dark:text-slate-400">Duration</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">{test.duration} min</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Available Centers */}
                                        <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                                            <div className="flex items-center mb-3">
                                                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-xl">
                                                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white ml-3">Available Centers</h4>
                                            </div>

                                            {hcsFilter && hcsFilter !== 'all' ? (
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                                        {hcs.find(h => h._id === hcsFilter)?.name}
                                                    </span>
                                                </div>
                                            ) : approvedHCSNames.length > 0 ? (
                                                <div className="mt-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        {approvedHCSNames.slice(0, 2).map((name, index) => (
                                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 dark:bg-slate-600 dark:text-white shadow-sm">
                                                                {name}
                                                            </span>
                                                        ))}
                                                        {approvedHCSNames.length > 2 && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 dark:bg-slate-600 dark:text-white shadow-sm">
                                                                +{approvedHCSNames.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 dark:text-slate-400 text-sm">No centers available</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        className={`w-full py-4 text-base font-bold rounded-2xl transition-all duration-300 bg-gradient-to-r ${color} hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center`}
                                        onClick={() => handleBookTest(test)}
                                        disabled={!test.hcsPricing.some(p => p.status === 'approved')}
                                    >
                                        <span className="flex items-center">
                                            Book Now
                                            <ChevronRight className="ml-2 h-5 w-5" />
                                        </span>
                                    </Button>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10"></div>
                                <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-white/10"></div>
                            </div>
                        );
                    })}
                </div>

                {filteredTests.length === 0 && (
                    <div className="text-center py-20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl shadow-lg">
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-200 dark:bg-slate-700 border-2 border-dashed rounded-2xl w-20 h-20" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Tests Found</h3>
                        <p className="text-gray-600 dark:text-slate-300 max-w-md mx-auto text-lg mb-8">
                            Try adjusting your filters or search terms to find what you're looking for.
                        </p>
                        <Button
                            variant="outline"
                            className="px-8 py-3 text-lg rounded-2xl border-2"
                            onClick={() => {
                                setSearchTerm('');
                                setTypeFilter('all');
                                setHcsFilter('all');
                                setSortBy('name');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Enhanced Booking Modal */}
            {bookingModalOpen && selectedTest && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100">
                        <div className={`bg-gradient-to-r ${selectedTest.type === 'Blood Test' ? 'from-red-500 to-orange-500' : selectedTest.type === 'X-Ray' ? 'from-blue-500 to-cyan-500' : selectedTest.type === 'MRI' ? 'from-purple-500 to-indigo-500' : selectedTest.type === 'CT Scan' ? 'from-green-500 to-teal-500' : selectedTest.type === 'Ultrasound' ? 'from-pink-500 to-rose-500' : selectedTest.type === 'ECG' ? 'from-yellow-500 to-amber-500' : 'from-gray-500 to-slate-500'} p-8`}>
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                {getTypeIcon(selectedTest.type)}
                                <span className="ml-3">{selectedTest.title}</span>
                            </h3>
                            <p className="text-blue-100 mt-2">{selectedTest.description}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Contact Information
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="pl-12 w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm transition-all"
                                    />
                                </div>
                            </div>

                            {/* Healthcare Center Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Healthcare Center
                                </label>
                                <Select
                                    value={selectedHCS}
                                    onValueChange={(value) => {
                                        setSelectedHCS(value);
                                        // Reset date and availability when HCS changes
                                        setSelectedDateTime('');
                                        setAvailableSlots(null);
                                    }}
                                >
                                    <SelectTrigger className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm transition-all">
                                        <SelectValue placeholder="Select Healthcare Center" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedTest.hcsPricing
                                            .filter(pricing => pricing.status === 'approved')
                                            .map(pricing => {
                                                // Handle both string and object formats for HCS reference
                                                const hcsId = typeof pricing.hcs === 'string' ? pricing.hcs : pricing.hcs._id;
                                                // Find the HCS in our HCS array
                                                const center = hcs.find(h => h._id === hcsId);
                                                return center ? (
                                                    <SelectItem key={center._id} value={center._id}>
                                                        {center.name}
                                                    </SelectItem>
                                                ) : null;
                                            })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Select Date and Time
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type="datetime-local"
                                        value={selectedDateTime}
                                        onChange={(e) => setSelectedDateTime(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="pl-12 w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm transition-all"
                                        disabled={!selectedHCS} // Disable until HCS is selected
                                    />
                                </div>

                                {availableSlots !== null && (
                                    <div className={`mt-4 p-4 rounded-2xl text-sm ${availableSlots.available > 0
                                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50'
                                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50'
                                        }`}>
                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 mr-2" />
                                            <span className="font-bold">
                                                {availableSlots.available > 0
                                                    ? `${availableSlots.available} slots available`
                                                    : 'No slots available'}
                                            </span>
                                        </div>
                                        <p className="text-xs mt-1 opacity-80">
                                            {availableSlots.available} of {availableSlots.total} slots remaining
                                        </p>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                                    Please select a future date and time for your appointment
                                </p>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6">
                                <Button
                                    variant="outline"
                                    className="rounded-2xl px-6 py-3 text-base font-bold border-2"
                                    onClick={() => {
                                        setBookingModalOpen(false);
                                        setSelectedTest(null);
                                        setSelectedDateTime('');
                                        setPhoneNumber('');
                                        setSelectedHCS('');
                                        setAvailableSlots(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={`rounded-2xl px-6 py-3 text-base font-bold bg-gradient-to-r ${selectedTest.type === 'Blood Test' ? 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' : selectedTest.type === 'X-Ray' ? 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' : selectedTest.type === 'MRI' ? 'from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' : selectedTest.type === 'CT Scan' ? 'from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600' : selectedTest.type === 'Ultrasound' ? 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600' : selectedTest.type === 'ECG' ? 'from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600' : 'from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600'} text-white shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105`}
                                    onClick={confirmBooking}
                                    disabled={!selectedHCS || (availableSlots && availableSlots.available === 0)}
                                >
                                    Confirm Booking
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiagnosticTests;