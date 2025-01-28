import React, { useState, useEffect } from 'react';
import { Bot, Wand2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Agent, AgentConnection } from '../types';

export default function Agent() {
  const [formData, setFormData] = useState({
    name: '',
    prompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          agent_connections (
            *,
            instance:instances (*)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Erro ao carregar agentes');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Save agent to database
      const { error } = await supabase
        .from('agents')
        .insert([{
          user_id: user.id,
          name: formData.name,
          prompt: formData.prompt
        }]);

      if (error) throw error;

      // Refresh agents list
      fetchAgents();

      setFormData({ name: '', prompt: '' });
    } catch (error) {
      console.error('Error creating agent:', error);
      setError('Erro ao criar agente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Bot className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agente IA</h1>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Display existing agents */}
        <div className="mb-6 space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{agent.prompt}</p>
              <div className="mt-2 text-xs text-gray-400">
                Conexões: {agent.agent_connections?.length || 0}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Agente
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Digite o nome do agente"
                required
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prompt do Agente
              </label>
              <textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Digite o prompt para o agente..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <Wand2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Gerar Prompt
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}