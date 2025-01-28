import React from 'react';
import { Cpu } from 'lucide-react';
import InstanceForm from '../components/InstanceForm';

export default function Connection() {
  return (
    <div className="p-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Cpu className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Gerenciador de Instâncias
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
          Crie e gerencie instâncias de clientes com facilidade
        </p>
      </div>
      
      <div className="mt-12 flex justify-center">
        <InstanceForm />
      </div>
    </div>
  );
}