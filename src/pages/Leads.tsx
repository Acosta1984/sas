import React from 'react';
import { UserPlus, X, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '../types';

export default function Leads() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Lead>>({
    fullName: '',
    email: '',
    whatsapp: '',
    address: '',
    number: '',
    city: '',
    state: '',
    company: '',
    value: 0,
    title: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: Date.now().toString(),
      title: formData.title || '',
      fullName: formData.fullName || '',
      email: formData.email || '',
      whatsapp: formData.whatsapp || '',
      address: formData.address || '',
      number: formData.number || '',
      city: formData.city || '',
      state: formData.state || '',
      company: formData.company || '',
      value: formData.value || 0,
      contact: formData.whatsapp || '',
      createdAt: new Date().toISOString()
    };

    // Here you would typically save the lead to your backend
    console.log('New lead:', newLead);

    // Navigate to CRM page
    navigate('/crm');
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <UserPlus className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Leads</h1>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-6 flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Novo Lead
        </button>

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white dark:bg-gray-800 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Novo Lead</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título/Cargo
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Empresa
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor Estimado
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Endereço
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Salvar Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Clique em "Novo Lead" para adicionar um novo contato ao CRM
          </p>
        </div>
      </div>
    </div>
  );
}