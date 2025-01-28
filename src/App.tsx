import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CRM from './pages/CRM';
import Leads from './pages/Leads';
import Agent from './pages/Agent';
import Connection from './pages/Connection';
import Integration from './pages/Integration';
import Settings from './pages/Settings';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AnalyticsProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                  <Sidebar />
                  <div className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/crm" element={<CRM />} />
                      <Route path="/leads" element={<Leads />} />
                      <Route path="/agent" element={<Agent />} />
                      <Route path="/connection" element={<Connection />} />
                      <Route path="/integration" element={<Integration />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          </Routes>
        </AnalyticsProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;