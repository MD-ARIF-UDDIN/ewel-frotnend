import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, className }) => {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-gray-400" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {trend && (
                    <div className={`flex items-center text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-1">{trend === 'up' ? '↗' : '↘'}</span>
                        {trendValue}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;

