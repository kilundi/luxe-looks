import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/common/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dark-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            <p
              className={`text-sm mt-2 ${
                trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change} from last month
            </p>
          </div>
          <div className={`${color} p-3 rounded-lg`}>
            <Icon className="text-white" size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
