import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Users, 
  UserPlus, 
  Bot,
  Link as LinkIcon, 
  Plug, 
  Settings,
  ChevronLeft
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'CRM', path: '/crm' },
  { icon: UserPlus, label: 'Leads', path: '/leads' },
  { icon: Bot, label: 'Agente', path: '/agent' },
  { icon: LinkIcon, label: 'Conexão', path: '/connection' },
  { icon: Plug, label: 'Integração', path: '/integration' },
  { icon: Settings, label: 'Configuração', path: '/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div 
      className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className={`text-xl font-semibold text-gray-800 dark:text-white ${isCollapsed ? 'hidden' : 'block'}`}>
          Menu
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  location.pathname === item.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`} />
                <span className={`font-medium ml-3 ${
                  isCollapsed ? 'hidden' : 'block'
                } ${
                  location.pathname === item.path ? 'text-indigo-600' : 'group-hover:text-indigo-600'
                }`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}