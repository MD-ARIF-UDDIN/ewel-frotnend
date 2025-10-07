import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Separator } from '../components/ui/separator';
import {
    Car, Heart, GraduationCap, Wrench, Star, Users, Shield, Clock, ArrowRight,
    CheckCircle, Globe, Phone, Mail, MapPin, Award, TrendingUp, Zap, Target,
    BookOpen, HeadphonesIcon, PlayCircle, Quote, ChevronLeft, ChevronRight,
    Lightbulb, Calendar, CreditCard, Lock, ShoppingCart, Package, Plus
} from 'lucide-react';
import api from '../api/axios';

const Landing = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        if (reviews.length > 1) {
            const interval = setInterval(() => {
                setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [reviews.length]);

    const fetchReviews = async () => {
        try {
            const response = await api.get('/reviews/public?limit=10&sortBy=createdAt&order=desc');
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const nextReview = () => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentReviewIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    };

    const goToReview = (index) => {
        setCurrentReviewIndex(index);
    };

    const formatUserRole = (role) => {
        switch (role) {
            case 'Customer':
                return 'Verified Customer';
            case 'HCS Admin':
                return 'Healthcare Professional';
            case 'Doctor':
                return 'Medical Doctor';
            default:
                return 'Platform User';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    };

    const services = [
        {
            title: 'Transportation',
            description: 'Public transport services and route planning',
            icon: Car,
            comingSoon: true,
            features: ['Route Planning', 'Real-time Tracking', 'Ticket Booking'],
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Healthcare',
            description: 'Book medical tests and healthcare services',
            icon: Heart,
            comingSoon: false,
            onClick: () => navigate('/healthcare'),
            features: ['Test Booking', 'Appointment Scheduling', 'Health Records'],
            color: 'from-red-500 to-red-600',
        },
        {
            title: 'Booking & Order Services',
            description: 'Seamless booking and ordering services for various needs',
            icon: BookOpen,
            comingSoon: true,
            features: ['Service Booking', 'Order Management', 'Real-time Updates'],
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Micro Business & Youth Growth Ecosystem',
            description: 'Supporting entrepreneurship and youth development',
            icon: Users,
            comingSoon: true,
            features: ['Business Support', 'Youth Programs', 'Growth Resources'],
            color: 'from-green-500 to-green-600',
        },
    ];

    const features = [
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Your data is protected with enterprise-grade security',
        },
        {
            icon: Clock,
            title: '24/7 Available',
            description: 'Access services anytime, anywhere with our platform',
        },
        {
            icon: Users,
            title: 'User-Friendly',
            description: 'Designed for everyone with intuitive interfaces',
        },
        {
            icon: Globe,
            title: 'Digital First',
            description: 'Modern digital solutions for modern citizens',
        },
    ];

    const [stats, setStats] = useState([
        { number: '0', label: 'Active Users', icon: Users },
        { number: '0', label: 'Healthcare Centers', icon: Heart },
        { number: '0', label: 'Available Tests', icon: Award },
        { number: '0%', label: 'Satisfaction Rate', icon: TrendingUp },
    ]);

    const faqs = [
        {
            question: 'How do I book a healthcare appointment?',
            answer: 'Simply click on the Healthcare service, browse available tests and centers, select your preferred time slot, and confirm your booking. You\'ll receive instant confirmation via email and SMS.'
        },
        {
            question: 'Is my personal information secure?',
            answer: 'Absolutely. We use enterprise-grade encryption and follow strict data protection protocols. Your information is never shared with third parties without your explicit consent.'
        },
        {
            question: 'Can I cancel or reschedule my appointments?',
            answer: 'Yes, you can easily cancel or reschedule appointments through your dashboard up to 24 hours before the scheduled time without any charges.'
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept all major credit cards, debit cards, digital wallets, and bank transfers. All payments are processed securely through encrypted channels.'
        },
        {
            question: 'How do I access other services like education and utilities?',
            answer: 'While healthcare is currently available, other services like education, transportation, and utilities are coming soon. You\'ll be notified when they become available.'
        }
    ];

    const achievements = [
        {
            icon: Award,
            title: 'Best Digital Platform 2024',
            description: 'Recognized by Digital Government Awards'
        },
        {
            icon: Shield,
            title: 'ISO 27001 Certified',
            description: 'International security standard compliance'
        },
        {
            icon: Users,
            title: 'Growing Community',
            description: 'Building trust with every service'
        },
        {
            icon: Target,
            title: '99.9% Uptime',
            description: 'Reliable service you can count on'
        }
    ];

    const processSteps = [
        {
            step: '01',
            title: 'Create Account',
            description: 'Sign up with your email and verify your identity securely',
            icon: Users
        },
        {
            step: '02',
            title: 'Choose Service',
            description: 'Browse and select from our comprehensive service catalog',
            icon: Target
        },
        {
            step: '03',
            title: 'Book & Pay',
            description: 'Schedule your appointment and make secure payment',
            icon: CheckCircle
        },
        {
            step: '04',
            title: 'Get Service',
            description: 'Attend your appointment and receive quality service',
            icon: Award
        }
    ];

    const enhancedFeatures = [
        {
            icon: Lightbulb,
            title: 'Smart Recommendations',
            description: 'AI-powered suggestions based on your preferences and history'
        },
        {
            icon: Calendar,
            title: 'Easy Scheduling',
            description: 'Book appointments with just a few clicks'
        },
        {
            icon: CreditCard,
            title: 'Secure Payments',
            description: 'Multiple payment options with bank-level security'
        },
        {
            icon: Lock,
            title: 'Privacy First',
            description: 'Your data is encrypted and never shared without consent'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 pt-20">
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-8 transition-colors duration-300" style={{ backgroundBlendMode: 'multiply' }}>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 to-purple-400/15"></div>
                </div>

                {/* Enhanced animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-purple-500/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 -right-20 w-60 h-60 bg-gradient-to-r from-indigo-400/15 to-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block mb-3">
                        <Badge className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-800 hover:from-blue-200/80 hover:to-indigo-200/80 transition-colors duration-300 px-3 py-1.5 text-sm font-medium border-0 backdrop-blur-sm shadow-lg dark:bg-gradient-to-r dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-200 animate-fade-in-down">
                            <Zap className="h-3 w-3 mr-1.5 animate-pulse" />
                            Next-Gen Public Services
                        </Badge>
                    </div>

                    <div className="mb-6 animate-staggered-letters" style={{ animationDelay: '0.5s' }}>
                        {/* Main Logo/Brand Name */}
                        <div className="relative inline-block group mb-4">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-500 bg-clip-text text-transparent tracking-tight">
                                EWEL
                            </h1>

                            {/* Floating decorative elements */}
                            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl animate-pulse"></div>
                            <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 opacity-20 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute top-0 -right-6 w-9 h-9 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-20 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                        </div>

                        {/* Tagline with enhanced styling */}
                        <div className="relative mt-1 mb-6">
                            <div className="inline-flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                                <h2 className="relative text-xl md:text-2xl lg:text-3xl font-light text-gray-700 dark:text-slate-200 tracking-wide font-poppins">
                                    <span className="inline-block bg-gradient-to-r from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-slate-700/50 shadow-lg px-6 py-3">
                                        Easy Way Easy Life
                                    </span>
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                        <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 leading-relaxed font-light">
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '0.9s' }}>Experience</span>
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '1.0s' }}>seamless</span>
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '1.1s' }}>access</span>
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '1.2s' }}>to</span>
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '1.3s' }}>healthcare,</span>
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '1.4s' }}>transportation,</span>
                            <span className="inline-block animate-float" style={{ animationDelay: '1.5s' }}>booking & ordering,</span>
                        </p>
                        <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 leading-relaxed font-light mt-1">
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '1.6s' }}>and</span>
                            <span className="inline-block mr-1 animate-float" style={{ animationDelay: '1.7s' }}>micro business</span>
                            <span className="inline-block animate-float" style={{ animationDelay: '1.8s' }}>services.</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '2.0s' }}>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-4 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 animate-pulse-slow"
                            onClick={() => navigate('/healthcare')}
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4 animate-bounce-horizontal" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/login-customer')}
                            className="font-semibold px-6 py-4 text-base rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 dark:border-slate-600 dark:text-slate-200 animate-pulse-slow"
                        >
                            Create Account
                        </Button>
                    </div>

                    <div className="relative max-w-3xl mx-auto">
                        <div className="flex justify-center gap-4 mt-6 opacity-80">
                            <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0s' }}>
                                <div className="p-2.5 rounded-xl shadow-modern bg-red-100">
                                    <Car className="h-5 w-5 text-red-500" />
                                </div>
                            </div>

                            <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0.3s' }}>
                                <div className="p-2.5 rounded-xl shadow-modern bg-green-100">
                                    <Heart className="h-5 w-5 text-green-500" />
                                </div>
                            </div>

                            <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0.6s' }}>
                                <div className="p-2.5 rounded-xl shadow-modern bg-blue-100">
                                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>

                            <div className="flex flex-col items-center animate-bounce" style={{ animationDelay: '0.9s' }}>
                                <div className="p-2.5 rounded-xl shadow-modern bg-purple-100">
                                    <Users className="h-5 w-5 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/40 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-600/40 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-5 w-64 h-64 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-5 w-64 h-64 bg-gradient-to-r from-indigo-400/15 to-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-16 animate-fade-in">
                        <Badge className="mb-6 bg-gradient-to-r from-blue-100/90 to-indigo-100/90 text-blue-800 hover:from-blue-200/90 hover:to-indigo-200/90 transition-all duration-500 px-6 py-3 text-base font-semibold border-0 backdrop-blur-sm shadow-xl dark:bg-gradient-to-r dark:from-blue-900/60 dark:to-indigo-900/60 dark:text-blue-200">
                            <Zap className="h-5 w-5 mr-3 animate-pulse" />
                            Premium Digital Services
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight font-poppins animate-slide-in-up">
                            Explore Our
                            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-500 bg-clip-text text-transparent animate-gradient-x">
                                Services
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up">
                            Comprehensive digital solutions designed for modern citizens.
                            <span className="block mt-2 font-medium text-gray-700 dark:text-gray-200">
                                Experience seamless, secure, and intelligent public services.
                            </span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <Card
                                    key={index}
                                    className={`group cursor-pointer transition-all duration-500 ease-out border-0 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl overflow-hidden relative service-card-glow transform hover:-translate-y-2 ${service.comingSoon
                                        ? 'opacity-80 hover:opacity-100'
                                        : 'hover:scale-[1.03]'
                                        }`}
                                    onClick={service.onClick}
                                >
                                    {/* Animated Gradient Border */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-30 transition-all duration-700 rounded-2xl blur-sm`}></div>

                                    {/* Floating Icon Background */}
                                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-white/20 to-white/5 rounded-full backdrop-blur-sm opacity-30 group-hover:opacity-50 transition-all duration-500"></div>

                                    <CardHeader className="text-center pb-5 pt-7 relative z-10">
                                        <div className={`mx-auto mb-6 p-5 bg-gradient-to-r ${service.color} rounded-2xl w-fit group-hover:scale-110 transition-all duration-300 shadow-xl relative overflow-hidden`}>
                                            {/* Icon Glow Effect */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${service.color} blur-lg opacity-40 scale-125`}></div>
                                            <Icon className="h-8 w-8 text-white relative z-10" />
                                        </div>
                                        <CardTitle className="text-xl mb-3 font-poppins font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                                            {service.title}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-1">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="text-center pt-0 pb-6 px-5 relative z-10">
                                        <div className="space-y-3 mb-6">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center text-xs text-gray-700 dark:text-gray-300 bg-gray-50/60 dark:bg-slate-700/60 rounded-lg p-2.5 backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-slate-600/80 transition-all duration-300">
                                                    <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                                                    </div>
                                                    <span className="font-medium">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {service.comingSoon ? (
                                            <div className="space-y-2">
                                                <Button disabled variant="outline" className="w-full rounded-lg py-4 text-sm font-semibold border-2 border-gray-300 bg-gray-100/50 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 transition-all duration-300">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    Coming Soon
                                                </Button>
                                                <p className="text-xs text-gray-500 font-medium dark:text-gray-400">Get notified when available</p>
                                            </div>
                                        ) : (
                                            <Button className={`w-full bg-gradient-to-r ${service.color} hover:scale-105 text-white font-semibold rounded-lg py-4 text-sm shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden group/btn`}>
                                                {/* Button Shine Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                                                <span className="relative z-10 flex items-center justify-center">
                                                    Access Service
                                                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                </span>
                                            </Button>
                                        )}
                                    </CardContent>

                                    {/* Premium Badge for Healthcare */}
                                    {!service.comingSoon && (
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-2.5 py-1 text-xs font-bold shadow-md animate-pulse-slow">
                                                ✓ Available
                                            </Badge>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>

                    {/* Call to Action Below Services */}
                    <div className="text-center mt-14 animate-fade-in-up">
                        <div className="inline-flex items-center space-x-5 bg-white/70 backdrop-blur-xl rounded-xl p-5 shadow-xl dark:bg-slate-800/70 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center space-x-2">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-700 font-medium dark:text-gray-200">Healthcare services are live now</span>
                            </div>
                            <Button
                                onClick={() => navigate('/healthcare')}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg py-4 text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
                            >
                                Start Booking
                                <ArrowRight className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section className="py-20 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                            <Zap className="h-4 w-4 mr-2" />
                            Platform Features
                        </Badge>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 font-poppins dark:text-slate-100">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light dark:text-slate-300">
                            Built with citizens in mind, designed for the future of public services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {enhancedFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="group">
                                    <Card className="h-full border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:-translate-y-2">
                                        <CardContent className="p-8">
                                            <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 dark:from-blue-900/50 dark:to-indigo-900/50">
                                                <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-3 font-poppins dark:text-slate-100">{feature.title}</h3>
                                            <p className="text-gray-600 leading-relaxed dark:text-slate-300">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                            <Zap className="h-4 w-4 mr-2" />
                            Simple Process
                        </Badge>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 font-poppins dark:text-slate-100">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light dark:text-slate-300">
                            Get started with our platform in just four simple steps
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div className="relative mb-6">
                                        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {step.step}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 font-poppins dark:text-slate-100">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed dark:text-slate-300">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Compact and Beautiful Reviews Carousel - Only show if we have reviews */}
            {!loading && reviews.length > 0 && (
                <section className="py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 transition-colors duration-300">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <Badge className="mb-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 text-xs dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                                <Quote className="h-3 w-3 mr-1" />
                                Customer Reviews
                            </Badge>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 font-poppins">
                                What Our Users Say
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                                Real feedback from satisfied citizens
                            </p>
                        </div>

                        {/* Reviews Carousel */}
                        <div className="relative">
                            {/* Main Review Display */}
                            <div className="overflow-hidden rounded-xl">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                                >
                                    {reviews.map((review, index) => (
                                        <div key={review._id} className="w-full flex-shrink-0 px-1">
                                            <Card className="border-0 shadow-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center mb-3">
                                                        <Avatar className="h-10 w-10 mr-3">
                                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold">
                                                                {getInitials(review.user?.name || 'Anonymous')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 text-sm dark:text-slate-100">{review.user?.name || 'Anonymous'}</h4>
                                                            <p className="text-xs text-gray-500 dark:text-slate-400">{review.user?.role ? formatUserRole(review.user.role) : 'User'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-slate-600'}`}
                                                            />
                                                        ))}
                                                    </div>

                                                    <p className="text-gray-700 dark:text-slate-300 text-xs leading-relaxed italic">"{review.review}"</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            {reviews.length > 1 && (
                                <>
                                    <button
                                        onClick={prevReview}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 bg-white dark:bg-slate-700 p-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-slate-600"
                                        aria-label="Previous review"
                                    >
                                        <ChevronLeft className="h-3 w-3 text-gray-600 dark:text-slate-300" />
                                    </button>
                                    <button
                                        onClick={nextReview}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-white dark:bg-slate-700 p-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-slate-600"
                                        aria-label="Next review"
                                    >
                                        <ChevronRight className="h-3 w-3 text-gray-600 dark:text-slate-300" />
                                    </button>
                                </>
                            )}

                            {/* Dots Indicator */}
                            {reviews.length > 1 && (
                                <div className="flex justify-center mt-4 space-x-1.5">
                                    {reviews.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToReview(index)}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentReviewIndex
                                                ? 'bg-blue-600 w-4'
                                                : 'bg-gray-300 dark:bg-slate-600'
                                                }`}
                                            aria-label={`Go to review ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <section className="py-20 bg-white dark:bg-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                                    <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 dark:from-blue-900/50 dark:to-indigo-900/50">
                                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 font-poppins">{stat.number}</div>
                                    <div className="text-gray-600 font-medium dark:text-gray-300">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 dark:bg-gradient-to-r dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                            <HeadphonesIcon className="h-4 w-4 mr-2" />
                            Support
                        </Badge>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 font-poppins dark:text-slate-100">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light dark:text-slate-300">
                            Find answers to common questions about our platform and services
                        </p>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 dark:border-slate-600">
                                <AccordionTrigger className="text-left hover:text-blue-600 font-semibold dark:hover:text-blue-400">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 leading-relaxed dark:text-slate-300">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div class="max-w-3xl mx-auto">
                        {/* Badge */}
                        <div class="inline-block mb-6">
                            <Badge class="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 text-sm font-medium">
                                <Zap class="h-4 w-4 mr-2" />
                                Transform Your Experience
                            </Badge>
                        </div>

                        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6 font-poppins leading-tight">
                            Ready to Transform Your
                            <span class="block mt-1 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                Public Service Experience?
                            </span>
                        </h2>

                        <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-light">
                            Join thousands of citizens enjoying <span class="font-medium text-white">seamless, secure</span> public services.
                        </p>

                        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                            <div class="relative group">
                                <div class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-70 blur animate-border-spin"></div>
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/login-customer')}
                                    class="relative w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-5 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform z-10 border-0"
                                >
                                    <span class="flex items-center">
                                        Create Free Account
                                        <ArrowRight class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                </Button>
                            </div>

                            <div class="relative group">
                                <div class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-70 blur animate-border-spin"></div>
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/healthcare')}
                                    class="relative w-full sm:w-auto bg-gradient-to-r from-white to-gray-100 text-blue-600 hover:from-gray-50 hover:to-gray-200 font-semibold px-8 py-5 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 z-10"
                                >
                                    <span class="flex items-center">
                                        Explore Services
                                        <PlayCircle class="ml-2 h-5 w-5" />
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <p class="text-blue-100 text-sm flex items-center justify-center">
                            <Lock class="h-4 w-4 mr-2" />
                            No credit card required • Set up in minutes
                        </p>
                    </div>
                </div>
            </section>

            {/* Add custom animations to head of component */}
            <style jsx>{`
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                
                @keyframes slide-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes gradient-x {
                    0%, 100% {
                        background-size: 200% 200%;
                        background-position: left center;
                    }
                    50% {
                        background-size: 200% 200%;
                        background-position: right center;
                    }
                }
                
                @keyframes pulse-slow {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
                
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
                
                @keyframes bounce-horizontal {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    50% {
                        transform: translateX(5px);
                    }
                }
                
                @keyframes border-spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                
                .animate-slide-in-up {
                    animation: slide-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                    display: inline-block;
                }
                
                .animate-bounce-horizontal {
                    animation: bounce-horizontal 1s ease-in-out infinite;
                }
                
                .animate-border-spin {
                    animation: border-spin 3s linear infinite;
                }
                
                .animate-staggered-letters span {
                    display: inline-block;
                    opacity: 0;
                    animation: fade-in 0.5s forwards;
                }
            `}</style>

            {/* Beautifully Enhanced Footer */}
            <footer className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white pt-16 pb-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                    <Globe className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">EWEL</h3>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                                Connecting citizens with essential public services through modern,
                                secure, and user-friendly digital solutions.
                            </p>

                            {/* Social Links */}
                            <div className="flex space-x-4 mb-6">
                                <a href="#" className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </a>
                                <a href="#" className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </a>
                                <a href="#" className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.073 1.645.073 4.849 0 3.205-.012 3.584-.07 4.849-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </a>
                                <a href="#" className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.073 1.645.073 4.849 0 3.205-.012 3.584-.07 4.849-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </a>
                                <a href="#" className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm0 19h-3v-11h3v11zm-1.5-12.268c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                                <a href="#" className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                                <a href="#" className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                </a>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-300 hover:text-white transition-colors">
                                    <Phone className="h-5 w-5 mr-3 text-blue-400" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-300 hover:text-white transition-colors">
                                    <Mail className="h-5 w-5 mr-3 text-blue-400" />
                                    <span>support@publicservice.gov</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-300 hover:text-white transition-colors">
                                    <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                                    <span>123 Public Service Ave, Gov City</span>
                                </div>
                            </div>
                        </div>

                        {/* Services Column */}
                        <div>
                            <h4 className="font-bold mb-6 text-lg relative inline-block">
                                <span className="relative z-10">Services</span>
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Healthcare
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Transportation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Education
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Utilities
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Government
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h4 className="font-bold mb-6 text-lg relative inline-block">
                                <span className="relative z-10">Support</span>
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        FAQs
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter Column */}
                        <div>
                            <h4 className="font-bold mb-6 text-lg relative inline-block">
                                <span className="relative z-10">Newsletter</span>
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
                            </h4>
                            <p className="text-gray-400 mb-4 text-sm">
                                Subscribe to get updates on new services and features.
                            </p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                                />
                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-800 my-8"></div>

                    {/* Bottom Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-500 text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} EWEL. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
                            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Accessibility</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;