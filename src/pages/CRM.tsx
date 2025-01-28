import React, { useState, useCallback, memo } from 'react';
import { Users, DollarSign, Building2, Phone, Calendar, Plus, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../components/StrictModeDroppable';
import type { Lead, Column } from '../types';
import { supabase } from '../lib/supabase';

const LeadCard = memo(({ lead, provided, snapshot }: any) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className={`bg-white rounded-lg p-4 shadow-sm ${
      snapshot.isDragging ? 'shadow-lg' : ''
    } transition-shadow duration-200`}
  >
    <h3 className="font-medium text-gray-900 mb-2">
      {lead.title}
    </h3>
    <div className="space-y-2 text-sm">
      <div className="flex items-center text-gray-600">
        <Building2 className="w-4 h-4 mr-2" />
        {lead.company}
      </div>
      <div className="flex items-center text-gray-600">
        <DollarSign className="w-4 h-4 mr-2" />
        {lead.value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </div>
      <div className="flex items-center text-gray-600">
        <Phone className="w-4 h-4 mr-2" />
        {lead.contact}
      </div>
      <div className="flex items-center text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
      </div>
    </div>
  </div>
));

LeadCard.displayName = 'LeadCard';

const initialLeads: { [key: string]: Lead } = {
  'lead-1': {
    id: 'lead-1',
    title: 'Implementação ERP',
    company: 'Tech Solutions',
    value: 50000,
    contact: '(11) 98765-4321',
    createdAt: '2024-03-15',
  },
  'lead-2': {
    id: 'lead-2',
    title: 'Consultoria Cloud',
    company: 'Cloud Nine',
    value: 35000,
    contact: '(11) 91234-5678',
    createdAt: '2024-03-14',
  },
  'lead-3': {
    id: 'lead-3',
    title: 'Migração de Dados',
    company: 'Data Corp',
    value: 75000,
    contact: '(11) 97654-3210',
    createdAt: '2024-03-13',
  },
};

const initialColumns: { [key: string]: Column } = {
  'novo': {
    id: 'novo',
    title: 'Novo Lead',
    leadIds: ['lead-1'],
  },
  'negociando': {
    id: 'negociando',
    title: 'Negociando',
    leadIds: ['lead-2'],
  },
  'correcao': {
    id: 'correcao',
    title: 'Correção',
    leadIds: [],
  },
  'fechado': {
    id: 'fechado',
    title: 'Fechado',
    leadIds: ['lead-3'],
  },
  'inativo': {
    id: 'inativo',
    title: 'Inativo',
    leadIds: [],
  },
};

export default function CRM() {
  const [leads, setLeads] = useState(initialLeads);
  const [columns, setColumns] = useState(initialColumns);
  const [columnOrder, setColumnOrder] = useState(['novo', 'negociando', 'correcao', 'fechado', 'inativo']);
  const [showNewColumnForm, setShowNewColumnForm] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const handleDeleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      // Update local state after successful deletion
      setLeads((prevLeads) => {
        const newLeads = { ...prevLeads };
        delete newLeads[leadId];
        return newLeads;
      });

      // Update columns state to remove the lead ID
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        Object.keys(newColumns).forEach((columnId) => {
          newColumns[columnId] = {
            ...newColumns[columnId],
            leadIds: newColumns[columnId].leadIds.filter((id) => id !== leadId),
          };
        });
        return newColumns;
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      // You might want to add error handling UI here
    }
  };

  const onDragEnd = useCallback((result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newLeadIds = Array.from(startColumn.leadIds);
      newLeadIds.splice(source.index, 1);
      newLeadIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        leadIds: newLeadIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    const startLeadIds = Array.from(startColumn.leadIds);
    startLeadIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      leadIds: startLeadIds,
    };

    const finishLeadIds = Array.from(finishColumn.leadIds);
    finishLeadIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishColumn,
      leadIds: finishLeadIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  }, [columns]);

  const getColumnColor = useCallback((columnId: string) => {
    const colors: { [key: string]: string } = {
      novo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      negociando: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      correcao: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      fechado: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      inativo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
    };
    return colors[columnId] || 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800';
  }, []);

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '-');
      setColumns({
        ...columns,
        [columnId]: {
          id: columnId,
          title: newColumnName.trim(),
          leadIds: [],
        },
      });
      setColumnOrder([...columnOrder, columnId]);
      setNewColumnName('');
      setShowNewColumnForm(false);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const newColumns = { ...columns };
    // Get all leads in this column
    const leadsToDelete = newColumns[columnId].leadIds;
    
    // Delete leads from Supabase
    leadsToDelete.forEach(async (leadId) => {
      try {
        await supabase
          .from('leads')
          .delete()
          .eq('id', leadId);
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    });

    // Update local state
    delete newColumns[columnId];
    setColumns(newColumns);
    setColumnOrder(columnOrder.filter(id => id !== columnId));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
        <Users className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Leads</h1>
        </div>
        <button
          onClick={() => setShowNewColumnForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Fluxo
        </button>
      </div>
      
      {showNewColumnForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Adicionar Novo Fluxo
            </h3>
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Nome do fluxo"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewColumnForm(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            const columnLeads = column.leadIds.map(leadId => leads[leadId]);

            return (
              <div 
                key={column.id}
                className={`relative rounded-lg border ${getColumnColor(column.id)} p-4 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-300">{column.title}</h2>
                  <button
                    onClick={() => handleDeleteColumn(column.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <StrictModeDroppable droppableId={column.id}>
                  {(provided, snapshot = { isDraggingOver: false }) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver ? 'bg-gray-50' : ''
                      } transition-colors duration-200`}
                    >
                      {columnLeads.map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided, snapshot = { isDragging: false }) => 
                            <div className="relative group">
                              <LeadCard lead={lead} provided={provided} snapshot={snapshot} />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLead(lead.id);
                                }}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          }
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}