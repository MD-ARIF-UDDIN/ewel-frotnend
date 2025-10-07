import { useState } from 'react';
import { cn } from '../lib/utils';

const Tabs = ({ tabs, activeTab, onTabChange, className }) => {
    return (
        <div className={cn("border-b border-gray-200", className)}>
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === tab.id
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        <div className="flex items-center space-x-2">
                            {tab.icon && <tab.icon className="h-4 w-4" />}
                            <span>{tab.label}</span>
                            {tab.badge && (
                                <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                    {tab.badge}
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;


