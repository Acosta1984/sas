import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useAnalytics } from '../context/AnalyticsContext';

export function MonthlyChart() {
  const { monthlyData } = useAnalytics();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Mensagens e Atendimentos Mensais</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} className="text-gray-600 dark:text-gray-400">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip />
            <Legend />
            <Bar dataKey="mensagens" fill="#4f46e5" />
            <Bar dataKey="atendimentos" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DailyChart() {
  const { dailyData } = useAnalytics();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Usuários Ativos por Dia</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData} className="text-gray-600 dark:text-gray-400">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="usuarios"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}