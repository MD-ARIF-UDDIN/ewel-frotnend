import { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import DatePicker from './ui/date-picker';
import api from '../api/axios';
import { useToast } from './ToastProvider';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

const MultiHCSSlotChecker = ({ hcsList = [], testList = [], onCheck }) => {
    const [selectedHCS, setSelectedHCS] = useState('');
    const [selectedTest, setSelectedTest] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Fetch availability based on selections
    const fetchAvailability = async () => {
        if (!selectedDate) return;

        setLoading(true);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];

            // Case 1: Both HCS and test selected - check specific HCS for specific test
            if (selectedHCS && selectedTest) {
                const response = await api.get(`/hcs/${selectedHCS}/availability?date=${formattedDate}`);
                setAvailability({
                    ...response.data.data,
                    hcs: selectedHCS,
                    test: selectedTest
                });
                if (onCheck) {
                    onCheck(response.data.data);
                }
            }
            // Case 2: Only test selected - check all HCS for that test
            else if (!selectedHCS && selectedTest) {
                const response = await api.get(`/hcs/availability?date=${formattedDate}&test=${selectedTest}`);
                setAvailability({
                    ...response.data.data,
                    test: selectedTest
                });
                if (onCheck) {
                    onCheck(response.data.data);
                }
            }
            // Case 3: Only HCS selected - check that HCS for all tests
            else if (selectedHCS && !selectedTest) {
                const response = await api.get(`/hcs/${selectedHCS}/availability?date=${formattedDate}`);
                setAvailability({
                    ...response.data.data,
                    hcs: selectedHCS
                });
                if (onCheck) {
                    onCheck(response.data.data);
                }
            }
            // Case 4: Neither selected - check all HCS for all tests
            else {
                const response = await api.get(`/hcs/availability?date=${formattedDate}`);
                setAvailability(response.data.data);
                if (onCheck) {
                    onCheck(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
            toast.error('Error', 'Failed to fetch availability: ' + (error.response?.data?.message || error.message));
            setAvailability(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleHCSChange = (hcsId) => {
        setSelectedHCS(hcsId === 'all' ? '' : hcsId);
        setAvailability(null);
    };

    const handleTestChange = (testId) => {
        setSelectedTest(testId === 'all' ? '' : testId);
        setAvailability(null);
    };

    const handleReset = () => {
        setSelectedHCS('');
        setSelectedTest('');
        setSelectedDate(new Date());
        setAvailability(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Find selected HCS name for display
    const getSelectedHCSName = () => {
        if (!selectedHCS) return '';
        const hcs = hcsList.find(h => h._id === selectedHCS);
        return hcs ? hcs.name : '';
    };

    // Find selected test name for display
    const getSelectedTestName = () => {
        if (!selectedTest) return '';
        const test = testList.find(t => t._id === selectedTest);
        return test ? test.title : '';
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Healthcare Center</label>
                    <Select value={selectedHCS} onValueChange={handleHCSChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a healthcare center" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Healthcare Centers</SelectItem>
                            {hcsList?.map((hcs) => (
                                <SelectItem key={hcs._id} value={hcs._id}>
                                    {hcs.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test</label>
                    <Select value={selectedTest} onValueChange={handleTestChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a test" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tests</SelectItem>
                            {testList?.map((test) => (
                                <SelectItem key={test._id} value={test._id}>
                                    {test.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <DatePicker
                            selectedDate={selectedDate}
                            onDateChange={handleDateChange}
                            className="flex-1"
                        />
                    </div>
                </div>

                <div className="flex items-end space-x-2">
                    <Button
                        onClick={fetchAvailability}
                        disabled={loading}
                    >
                        {loading ? 'Checking...' : 'Check'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {availability && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">{formatDate(availability.date)}</h3>
                        {selectedHCS && (
                            <p className="text-gray-600 mb-2">
                                {getSelectedHCSName()}
                                {selectedTest && ` - ${getSelectedTestName()}`}
                            </p>
                        )}
                        {!selectedHCS && selectedTest && (
                            <p className="text-gray-600 mb-2">
                                All HCS for {getSelectedTestName()}
                            </p>
                        )}
                        {!selectedHCS && !selectedTest && (
                            <p className="text-gray-600 mb-2">
                                All HCS for All Tests
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-600 rounded-lg">
                                <Users className="h-6 w-6 text-blue-500 mb-2" />
                                <span className="text-2xl font-bold">{availability.total}</span>
                                <span className="text-sm text-gray-500">Total Slots</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-600 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                                <span className="text-2xl font-bold">{availability.booked}</span>
                                <span className="text-sm text-gray-500">Booked</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-600 rounded-lg">
                                <XCircle className="h-6 w-6 text-red-500 mb-2" />
                                <span className="text-2xl font-bold">{availability.available}</span>
                                <span className="text-sm text-gray-500">Available</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-4">
                                <div
                                    className="bg-blue-500 h-4 rounded-full"
                                    style={{ width: `${(availability.booked / availability.total) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiHCSSlotChecker;