import React from 'react';
import { LayoutDashboard, Users, Plug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../context/AnalyticsContext';
import { MonthlyChart, DailyChart } from '../components/AnalyticsCharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { leadsData } = useAnalytics();

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <LayoutDashboard className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/connection')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total de Instâncias</h3>
            <Plug className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total de Instâncias</h3>
          <p className="text-3xl font-bold text-indigo-600">{leadsData.total}</p>
        </div>
        <div 
          onClick={() => navigate('/connection')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Conexões Ativas</h3>
            <Plug className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Conexões Ativas</h3>
          <p className="text-3xl font-bold text-green-600">{leadsData.active}</p>
        </div>
        <div 
          onClick={() => navigate('/crm')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Configuração Pendente</h3>
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Configuração Pendente</h3>
          <p className="text-3xl font-bold text-orange-600">{leadsData.pending}</p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart />
        <DailyChart />
      </div>
      
    </div>
  );
}