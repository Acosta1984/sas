import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ChevronDown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Plan } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null); 
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);

  // Fetch available plans from Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .order('price');

        if (error) throw error;

        setAvailablePlans(data);
        setSelectedPlan(data?.[0] || null);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError('Erro ao carregar planos. Por favor, tente novamente.');
      }
    };

    fetchPlans();
  }, []);
  const [formData, setFormData] = useState({
    email: '',
    password: '', 
    confirmPassword: ''
  });

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('No user data returned');

        navigate('/dashboard');
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('No user data returned');
        
        // Create user in our users table
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            name: data.user.email?.split('@')[0] || 'User',
          }]);

        if (insertError) throw insertError;

        // Create user plan
        const { error: planError } = await supabase
          .from('user_plans')
          .insert(selectedPlan ? [{
            user_id: data.user.id,
            plan_id: selectedPlan.id,
            status: 'active',
            start_date: new Date().toISOString(),
          }] : []);

        if (planError) throw planError;

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('invalid login credentials')) {
          setError('Email ou senha inválidos');
        } else if (message.includes('user already registered')) {
          setError('Este email já está cadastrado. Por favor, faça login ou use outro email.');
        } else if (message.includes('weak_password')) {
          setError('A senha deve ter pelo menos 6 caracteres');
        } else if (message.includes('no user data returned')) {
          setError('Erro de autenticação. Por favor, tente novamente.');
        } else {
          setError('Ocorreu um erro. Por favor, tente novamente.');
        }
      } else {
        setError('Ocorreu um erro durante a autenticação');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setError(null); // Clear error when user types
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
                <span className="text-xs text-gray-500 ml-1">(mínimo 6 caracteres)</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError(null); // Clear error when user types
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar Senha
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setError(null); // Clear error when user types
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="********"
                    />
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPlans(!showPlans)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 flex items-center justify-between"
                  >
                    <span className="block truncate text-gray-700 dark:text-gray-300">
                      {selectedPlan ? `${selectedPlan.name} - ${selectedPlan.price}` : 'Selecione um plano'}
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {showPlans && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1">
                      {availablePlans.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowPlans(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <div className="font-medium">{plan.name} - {plan.price}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {Array.isArray(plan.features) ? plan.features.join(' • ') : plan.features}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {isLogin ? 'Novo por aqui?' : 'Já tem uma conta?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLogin ? 'Criar nova conta' : 'Fazer login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}