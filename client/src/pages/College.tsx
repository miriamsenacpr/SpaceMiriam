import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  type: 'assignment' | 'exam' | 'material' | 'note';
  priority: 'low' | 'medium' | 'high';
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export default function College() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: '📝 A Fazer',
      cards: [
        {
          id: '1',
          title: 'Trabalho de Cálculo',
          description: 'Resolver exercícios 1-50',
          dueDate: '2024-06-10',
          subject: 'Cálculo I',
          type: 'assignment',
          priority: 'high',
        },
        {
          id: '2',
          title: 'Ler capítulo 5',
          description: 'Física Quântica',
          dueDate: '2024-06-12',
          subject: 'Física',
          type: 'material',
          priority: 'medium',
        },
      ],
    },
    {
      id: 'inprogress',
      title: '🚀 Em Andamento',
      cards: [
        {
          id: '3',
          title: 'Estudar para prova',
          description: 'Revisar todos os tópicos',
          dueDate: '2024-06-08',
          subject: 'Cálculo I',
          type: 'exam',
          priority: 'high',
        },
      ],
    },
    {
      id: 'review',
      title: '👀 Revisão',
      cards: [
        {
          id: '4',
          title: 'Projeto final',
          description: 'Aguardando feedback',
          dueDate: '2024-06-15',
          subject: 'Programação',
          type: 'assignment',
          priority: 'medium',
        },
      ],
    },
    {
      id: 'done',
      title: '✅ Concluído',
      cards: [
        {
          id: '5',
          title: 'Prova de Português',
          description: 'Nota: 9.5',
          dueDate: '2024-06-01',
          subject: 'Português',
          type: 'exam',
          priority: 'high',
        },
      ],
    },
  ]);

  const [showNewCard, setShowNewCard] = useState<string | null>(null);
  const [newCardData, setNewCardData] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    type: 'assignment' as const,
    priority: 'medium' as const,
  });

  const [subjects] = useState([
    'Cálculo I',
    'Física',
    'Programação',
    'Português',
    'Inglês',
    'História',
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return '📋';
      case 'exam':
        return '📝';
      case 'material':
        return '📚';
      case 'note':
        return '📌';
      default:
        return '📄';
    }
  };

  const addCard = (columnId: string) => {
    if (newCardData.title.trim()) {
      const newCard: Card = {
        id: Date.now().toString(),
        ...newCardData,
      };

      setColumns(
        columns.map((col) =>
          col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
        )
      );

      setNewCardData({
        title: '',
        description: '',
        dueDate: '',
        subject: '',
        type: 'assignment',
        priority: 'medium',
      });
      setShowNewCard(null);
    }
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
  };

  const moveCard = (fromColumnId: string, toColumnId: string, cardId: string) => {
    const card = columns
      .find((col) => col.id === fromColumnId)
      ?.cards.find((c) => c.id === cardId);

    if (!card) return;

    setColumns(
      columns.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        if (col.id === toColumnId) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      })
    );
  };

  return (
    <LifeOSLayout activeModule="college">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">🎓 Faculdade</h1>
            <p className="text-slate-600 dark:text-slate-400">Organize seus trabalhos, provas e materiais</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total de Tarefas', value: columns.reduce((acc, col) => acc + col.cards.length, 0), color: 'from-rose-400 to-pink-500' },
            { label: 'Em Andamento', value: columns.find(c => c.id === 'inprogress')?.cards.length || 0, color: 'from-blue-400 to-cyan-500' },
            { label: 'Concluído', value: columns.find(c => c.id === 'done')?.cards.length || 0, color: 'from-green-400 to-emerald-500' },
            { label: 'Disciplinas', value: subjects.length, color: 'from-purple-400 to-pink-500' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="glassmorphism rounded-xl p-4 flex flex-col max-h-[600px]">
              {/* Column Header */}
              <div className="mb-4 pb-4 border-b border-rose-200 dark:border-slate-600">
                <h2 className="font-bold text-slate-900 dark:text-white mb-2">{column.title}</h2>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {column.cards.length} {column.cards.length === 1 ? 'item' : 'itens'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setShowNewCard(column.id)}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>

              {/* Add New Card Form */}
              {showNewCard === column.id && (
                <div className="mb-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-600 space-y-2">
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    value={newCardData.title}
                    onChange={(e) => setNewCardData({ ...newCardData, title: e.target.value })}
                    className="w-full px-2 py-1 text-sm rounded border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Descrição"
                    value={newCardData.description}
                    onChange={(e) => setNewCardData({ ...newCardData, description: e.target.value })}
                    className="w-full px-2 py-1 text-sm rounded border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <select
                    value={newCardData.subject}
                    onChange={(e) => setNewCardData({ ...newCardData, subject: e.target.value })}
                    className="w-full px-2 py-1 text-sm rounded border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Selecione uma disciplina</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newCardData.dueDate}
                    onChange={(e) => setNewCardData({ ...newCardData, dueDate: e.target.value })}
                    className="w-full px-2 py-1 text-sm rounded border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => addCard(column.id)}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      Adicionar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowNewCard(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {/* Cards */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {column.cards.length === 0 ? (
                  <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-8">
                    Nenhum item
                  </p>
                ) : (
                  column.cards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-rose-400 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(card.type)}</span>
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                              {card.title}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCard(column.id, card.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                        >
                          <X size={14} className="text-red-500" />
                        </button>
                      </div>

                      {card.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          {card.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {card.subject && (
                          <span className="text-xs px-2 py-1 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded">
                            {card.subject}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(card.priority)}`}>
                          {card.priority === 'high' ? '🔴' : card.priority === 'medium' ? '🟡' : '🟢'}{' '}
                          {card.priority}
                        </span>
                      </div>

                      {card.dueDate && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          📅 {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LifeOSLayout>
  );
}
