import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lead } from '../types';

interface AnalyticsContextType {
  monthlyData: Array<{
    name: string;
    mensagens: number;
    atendimentos: number;
  }>;
  dailyData: Array<{
    name: string;
    usuarios: number;
  }>;
  leadsData: {
    total: number;
    active: number;
    pending: number;
  };
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsContextType>({
    monthlyData: [
      { name: 'Jan', mensagens: 4000, atendimentos: 2400 },
      { name: 'Fev', mensagens: 3000, atendimentos: 1398 },
      { name: 'Mar', mensagens: 2000, atendimentos: 9800 },
      { name: 'Abr', mensagens: 2780, atendimentos: 3908 },
      { name: 'Mai', mensagens: 1890, atendimentos: 4800 },
      { name: 'Jun', mensagens: 2390, atendimentos: 3800 },
    ],
    dailyData: [
      { name: 'Seg', usuarios: 3200 },
      { name: 'Ter', usuarios: 4500 },
      { name: 'Qua', usuarios: 3800 },
      { name: 'Qui', usuarios: 4100 },
      { name: 'Sex', usuarios: 5200 },
      { name: 'Sab', usuarios: 4800 },
      { name: 'Dom', usuarios: 3500 },
    ],
    leadsData: {
      total: 24,
      active: 18,
      pending: 6,
    },
  });

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}