import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({ selectedDate, onDateChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleDateClick = (date) => {
        onDateChange(date);
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
        });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const days = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <Input
                    type="text"
                    value={selectedDate ? formatDate(selectedDate) : ''}
                    onClick={() => setIsOpen(!isOpen)}
                    readOnly
                    placeholder="Select date"
                    className="pl-10 cursor-pointer"
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-4 w-64">
                    <div className="flex items-center justify-between mb-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handlePrevMonth}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="font-medium">{monthName}</div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleNextMonth}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-slate-400 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((date, index) => (
                            <div key={index} className="p-1">
                                {date ? (
                                    <Button
                                        type="button"
                                        variant={isSelected(date) ? "default" : isToday(date) ? "outline" : "ghost"}
                                        size="sm"
                                        className={`w-full h-8 text-xs ${isSelected(date) ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        {date.getDate()}
                                    </Button>
                                ) : (
                                    <div className="h-8"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onDateChange(new Date());
                                setIsOpen(false);
                            }}
                        >
                            Today
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;