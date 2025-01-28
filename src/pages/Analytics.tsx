import React from 'react';
import { BarChart2 } from 'lucide-react';
import { MonthlyChart, DailyChart } from '../components/AnalyticsCharts';

export default function Analytics() {
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <BarChart2 className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart />
        <DailyChart />
      </div>
    </div>
  );
}