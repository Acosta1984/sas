import React, { useState, useEffect } from 'react';
import { Instance, WebhookResponse } from '../types';
import { Plus, User, QrCode, Loader2, X, Trash, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function InstanceForm() {
  const [instance, setInstance] = useState<Instance>({ name: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<WebhookResponse | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = async () => {
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Usuário não autenticado. Faça login novamente.');

      const { data, error } = await supabase
        .from('instances')
        .select(`
          *,
          agent_connections (
            *,
            agent:agents (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstances(data || []);
    } catch (error: any) {
      console.error('Error fetching instances:', error);
      setError(error.message || 'Erro ao carregar instâncias.');
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const isValidWhatsApp = (number: string) => /^[1-9]\d{10,14}$/.test(number.replace(/\D/g, ''));

  const isFormValid = instance.name.trim() && isValidWhatsApp(instance.whatsapp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Usuário não autenticado. Faça login novamente.');

      const newInstance = { ...instance };
      const { data, error } = await supabase
        .from('instances')
        .insert([{ ...newInstance, user_id: user.id }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setInstances((prev) => [data[0], ...prev]);
        setInstance({ name: '', whatsapp: '' });
        setShowForm(false);
      } else {
        throw new Error('Erro inesperado. Nenhuma instância foi criada.');
      }
    } catch (error: any) {
      console.error('Error creating instance:', error);
      setError(error.message || 'Erro ao criar instância. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (inst: Instance) => {
    setSelectedInstance(inst);
    setLoading(true);
    setResponse(null);
    setError(null);

    if (!inst.name || !inst.whatsapp) {
      setResponse({
        success: false,
        message: 'Dados da instância incompletos'
      });
      setLoading(false);
      return;
    }

    // Format the number to remove any non-digits and ensure it starts with country code
    const cleanNumber = inst.whatsapp.replace(/\D/g, '');
    const formattedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;

    const formattedData = {
      name: inst.name,
      number: formattedNumber
    };

    if (!formattedData.number || formattedData.number.length < 12) {
      setResponse({
        success: false,
        message: 'Número de WhatsApp inválido. Use o formato: DDD + número (Ex: 11999999999)'
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        'https://webhookbuilder.iainfinito.com.br/webhook/Creat/Instance/Cliente',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(formattedData)
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Erro do servidor: ${res.status}`);
      }

      const data = await res.json();
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error('Resposta vazia do servidor');
      }

      const responseData = Array.isArray(data) ? data[0] : data;

      if (!responseData.data?.base64) {
        throw new Error('QR Code não disponível no momento. Tente novamente.');
      }

      setResponse({
        success: true,
        message: 'QR Code gerado com sucesso!',
        data: {
          base64: responseData.data.base64
        }
      });

      // Update instance status
      if (inst.id) {
        await supabase
          .from('instances')
          .update({ status: 'active' })
          .eq('id', inst.id)
          .then(() => fetchInstances())
          .catch(console.error);
      }
    } catch (error) {
      console.error('Falha ao gerar QR code:', error);
      setResponse({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao gerar QR Code. Tente novamente.'
      });
      
      // Update instance status on error
      if (inst.id) {
        await supabase
          .from('instances')
          .update({ status: 'error' })
          .eq('id', inst.id)
          .then(() => fetchInstances())
          .catch(console.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQR = async (inst: Instance) => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://webhookbuilder.iainfinito.com.br/webhook/Creat/conect/Cliente',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ name: inst.name }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert('QR Code atualizado com sucesso!');
      } else {
        throw new Error(data.message || 'Erro ao atualizar QR Code.');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar QR Code:', error);
      alert(error.message || 'Erro ao atualizar QR Code. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstance = async (inst: Instance) => {
    setLoading(true);
    setError(null);
    
    if (!inst.id) {
      setError('ID da instância não encontrado');
      setLoading(false);
      return;
    }

    try {
      // First delete from Supabase to maintain data consistency
      const { error: dbError } = await supabase
        .from('instances')
        .delete()
        .eq('id', inst.id);

      if (dbError) throw dbError;

      // Then try to delete from webhook service
      const res = await fetch(
        'https://webhookbuilder.iainfinito.com.br/webhook/delet/instance/cliente',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ name: inst.name }),
        }
      );
      
      // Even if webhook deletion fails, we've already removed from our DB
      if (!res.ok) {
        console.warn('Webhook deletion failed, but instance was removed from database');
      }
      
      setInstances((prev) => prev.filter((item) => item.id !== inst.id));
      setError('success:Instância excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir instância:', error);
      if (error instanceof Error) {
        setError(error.message.includes('Foreign key violation') 
          ? 'Não é possível excluir esta instância pois ela está sendo usada por outros recursos.'
          : error.message);
      } else {
        setError('Erro ao excluir instância. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderError = () => {
    if (!error) return null;
    
    if (error.startsWith('success:')) {
      return (
        <div className="col-span-full p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          {error.replace('success:', '')}
        </div>
      );
    }
    
    return (
      <div className="col-span-full p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
        {error}
      </div>
    );
  };

  const closeResponseModal = () => {
    setResponse(null);
    setSelectedInstance(null);
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Instância
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderError()}
        {instances.map((inst, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{inst.name}</h3>
                <p className="text-sm text-gray-500">{inst.whatsapp}</p>
              </div>
            </div>
            <div className="flex mt-4 space-x-2">
              <button
                onClick={() => handleGenerateQR(inst)}
                className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                title="Gerar QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleUpdateQR(inst)}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                title="Atualizar QR Code"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteInstance(inst)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                title="Deletar Instância"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Nome da Instância
                </label>
                <input
                  type="text"
                  id="name"
                  value={instance.name}
                  onChange={(e) => setInstance({ ...instance, name: e.target.value })}
                  className="block w-full mt-1 rounded-md border-gray-300 shadow-sm"
                  placeholder="Digite o nome da instância"
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium">
                  Número do WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={instance.whatsapp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setInstance({ ...instance, whatsapp: value });
                  }}
                  className="block w-full mt-1 rounded-md border-gray-300 shadow-sm"
                  placeholder="11999999999"
                  pattern="\d*"
                  maxLength={11}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Digite apenas DDD + número, sem o código do país
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  disabled={!isFormValid || loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {response && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeResponseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">QR Code</h3>
            </div>
            {response.success && response.data?.base64 && (
              <div className="bg-white p-4 rounded-lg">
                <img 
                  src={response.data.base64.startsWith('data:image') ? response.data.base64 : `data:image/png;base64,${response.data.base64}`} 
                  alt="QR Code" 
                  className="w-full h-auto max-w-[300px] mx-auto"
                />
                <p className="text-sm text-gray-500 text-center mt-4">
                  Escaneie este QR Code no WhatsApp para conectar sua instância
                </p>
              </div>
            )}
            {!response.success && response.message && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4">
                <p className="text-sm">{response.message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}