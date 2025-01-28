import React, { useState } from 'react';
import { Plug, CreditCard, Key, Save, Eye, EyeOff } from 'lucide-react';

export default function Integration() {
  const [mercadoPagoConfig, setMercadoPagoConfig] = useState({
    accessToken: '',
    publicKey: '',
  });
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saved Mercado Pago configuration:', mercadoPagoConfig);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Plug className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrações</h1>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mercado Pago Integration Card */}
        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Mercado Pago
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Access Token
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showAccessToken ? "text" : "password"}
                        value={mercadoPagoConfig.accessToken}
                        onChange={(e) => setMercadoPagoConfig(prev => ({
                          ...prev,
                          accessToken: e.target.value
                        }))}
                        className="block w-full pl-10 pr-12 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="TEST-0123456789..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccessToken(!showAccessToken)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showAccessToken ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Encontre seu Access Token no painel do Mercado Pago
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Public Key
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={mercadoPagoConfig.publicKey}
                        onChange={(e) => setMercadoPagoConfig(prev => ({
                          ...prev,
                          publicKey: e.target.value
                        }))}
                        className="block w-full pl-10 py-2 sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="TEST-0123456789..."
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Encontre sua Public Key no painel do Mercado Pago
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isSaving ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar Configuração'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}