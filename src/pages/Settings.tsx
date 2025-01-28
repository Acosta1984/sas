import React from 'react';
import { Settings as SettingsIcon, Sun, Moon, LogOut, User, Mail, Lock, Plus, Trash2, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '../types';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userForm, setUserForm] = React.useState({
    name: 'John Doe',  // Example registered user
    email: 'john@example.com',
    password: '',
    confirmPassword: ''
  });
  const [plans, setPlans] = React.useState<Plan[]>([
    {
      id: 'basic',
      name: 'Básico',
      price: 49.90,
      features: ['1 Instância', 'Suporte básico', 'Recursos essenciais']
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 99.90,
      features: ['5 Instâncias', 'Suporte prioritário', 'Recursos avançados']
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 199.90,
      features: ['Instâncias ilimitadas', 'Suporte 24/7', 'Recursos exclusivos']
    }
  ]);
  const [newPlan, setNewPlan] = React.useState<Plan>({
    id: '',
    name: '',
    price: 0,
    features: ['']
  });
  const [showNewPlanForm, setShowNewPlanForm] = React.useState(false);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add user registration logic here
    console.log('User form submitted:', userForm);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlan.name && newPlan.price > 0) {
      setPlans([...plans, { ...newPlan, id: Date.now().toString() }]);
      setNewPlan({ id: '', name: '', price: 0, features: [''] });
      setShowNewPlanForm(false);
    }
  };
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <SettingsIcon className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Cadastro de Usuário
            </h2>
            
            {/* Display registered user */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{userForm.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{userForm.email}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="********"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmar Senha
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="********"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>

        {/* Theme and Logout Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-md">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'light' ? <Sun className="w-5 h-5 text-gray-600" /> : <Moon className="w-5 h-5 text-gray-400" />}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {theme === 'light' ? 'Tema Claro' : 'Tema Escuro'}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-gray-200 dark:bg-indigo-600"
              >
                <span className="sr-only">Alternar tema</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Sair do Sistema
            </button>
          </div>
        </div>
        </div>

        {/* Plans Management Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Gerenciamento de Planos
              </h2>
              <button
                onClick={() => setShowNewPlanForm(!showNewPlanForm)}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Novo Plano
              </button>
            </div>

            {showNewPlanForm && (
              <form onSubmit={handleAddPlan} className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome do Plano
                    </label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
                      placeholder="Ex: Plano Premium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
                      placeholder="99.90"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recursos (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={newPlan.features.join(', ')}
                    onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split(',').map(f => f.trim()) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
                    placeholder="Recurso 1, Recurso 2, Recurso 3"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPlanForm(false)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
                  >
                    Adicionar Plano
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative group bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    R$ {plan.price.toFixed(2)}
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}