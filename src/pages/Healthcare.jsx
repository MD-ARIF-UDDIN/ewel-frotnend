import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { HeartPulse, Microscope, User } from 'lucide-react';
import { useToast } from '../components/ToastProvider';

const Healthcare = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleDiagnosticTests = () => {
        navigate('/diagnostic-tests');
    };

    const handleDoctorAppointment = () => {
        toast.info('Info', 'Doctor appointments are coming soon. Please check back later.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <HeartPulse className="h-12 w-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Healthcare Services</h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Choose from our healthcare services to book your appointment
                    </p>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2" onClick={handleDiagnosticTests}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                                <Microscope className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-center text-2xl">Diagnostic Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center text-gray-600 dark:text-gray-300 mb-6">
                                Book comprehensive diagnostic tests at top healthcare centers
                            </CardDescription>
                            <Button className="w-full transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg" variant="default">
                                Book Diagnostic Tests
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2" onClick={handleDoctorAppointment}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-center text-2xl">Doctor Appointment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-center text-gray-600 dark:text-gray-300 mb-6">
                                Schedule an appointment with experienced doctors and specialists
                            </CardDescription>
                            <Button className="w-full transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg" variant="default">
                                Book Doctor Appointment
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Healthcare;