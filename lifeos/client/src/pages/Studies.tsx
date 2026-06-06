import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, BookOpen } from 'lucide-react';

interface StudyItem {
  id: string;
  title: string;
  type: 'course' | 'video' | 'book' | 'article' | 'podcast';
  link: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
}

export default function Studies() {
  const [items, setItems] = useState<StudyItem[]>([
    {
      id: '1',
      title: 'React Advanced Patterns',
      type: 'course',
      link: 'https://example.com',
      category: 'Programação',
      priority: 'high',
      status: 'in-progress',
      progress: 60,
    },
    {
      id: '2',
      title: 'The Art of Computer Programming',
      type: 'book',
      link: 'https://example.com',
      category: 'Algoritmos',
      priority: 'medium',
      status: 'pending',
      progress: 0,
    },
    {
      id: '3',
      title: 'Web Development Fundamentals',
      type: 'video',
      link: 'https://example.com',
      category: 'Web',
      priority: 'high',
      status: 'in-progress',
      progress: 40,
    },
  ]);

  const [showNewItem, setShowNewItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'course' as const,
    link: '',
    category: '',
    priority: 'medium' as const,
    status: 'pending' as const,
    progress: 0,
  });

  const types = [
    { value: 'course', label: 'Curso', icon: '🎓' },
    { value: 'video', label: 'Vídeo', icon: '🎥' },
    { value: 'book', label: 'Livro', icon: '📚' },
    { value: 'article', label: 'Artigo', icon: '📰' },
    { value: 'podcast', label: 'Podcast', icon: '🎙️' },
  ];

  const categories = ['Programação', 'Algoritmos', 'Web', 'Mobile', 'Design', 'Negócios', 'Soft Skills'];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'pending':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    return types.find(t => t.value === type)?.icon || '📖';
  };

  const addItem = () => {
    if (newItem.title.trim()) {
      setItems([...items, {
        id: Date.now().toString(),
        ...newItem,
      }]);
      setNewItem({
        title: '',
        type: 'course',
        link: '',
        category: '',
        priority: 'medium',
        status: 'pending',
        progress: 0,
      });
      setShowNewItem(false);
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateProgress = (id: string, progress: number) => {
    setItems(items.map(i => i.id === id ? { ...i, progress: Math.min(100, Math.max(0, progress)) } : i));
  };

  const updateStatus = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    setItems(items.map(i => i.id === id ? { ...i, status, progress: status === 'completed' ? 100 : i.progress } : i));
  };

  const completedCount = items.filter(i => i.status === 'completed').length;
  const inProgressCount = items.filter(i => i.status === 'in-progress').length;

  return (
    <LifeOSLayout activeModule="studies">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">📚 Estudos</h1>
            <p className="text-slate-600 dark:text-slate-400">Organize seus cursos, livros e conteúdos de aprendizado</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{items.length}</div>
            <p className="text-sm opacity-90">Total de itens</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{inProgressCount}</div>
            <p className="text-sm opacity-90">Em progresso</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{completedCount}</div>
            <p className="text-sm opacity-90">Concluídos</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{Math.round((completedCount / items.length) * 100) || 0}%</div>
            <p className="text-sm opacity-90">Taxa de conclusão</p>
          </div>
        </div>

        {/* Add New Item */}
        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Adicionar Conteúdo</h2>
            <Button
              size="sm"
              onClick={() => setShowNewItem(!showNewItem)}
              className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
            >
              <Plus size={16} className="mr-1" /> Novo
            </Button>
          </div>

          {showNewItem && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-600 space-y-3">
              <input
                type="text"
                placeholder="Título"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="url"
                placeholder="Link (opcional)"
                value={newItem.link}
                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {types.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Categoria</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="low">Baixa Prioridade</option>
                <option value="medium">Média Prioridade</option>
                <option value="high">Alta Prioridade</option>
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={addItem}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Adicionar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowNewItem(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="glassmorphism p-4 rounded-xl hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl mt-1">{getTypeIcon(item.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded">
                        {item.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(item.priority)}`}>
                        {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'} {item.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Progresso</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-400 to-pink-500 h-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(item.id, 'pending')}
                  className={`flex-1 text-xs py-1 rounded transition-colors ${
                    item.status === 'pending'
                      ? 'bg-slate-400 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Pendente
                </button>
                <button
                  onClick={() => updateStatus(item.id, 'in-progress')}
                  className={`flex-1 text-xs py-1 rounded transition-colors ${
                    item.status === 'in-progress'
                      ? 'bg-blue-400 text-white'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
                  }`}
                >
                  Em Progresso
                </button>
                <button
                  onClick={() => updateStatus(item.id, 'completed')}
                  className={`flex-1 text-xs py-1 rounded transition-colors ${
                    item.status === 'completed'
                      ? 'bg-green-400 text-white'
                      : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200'
                  }`}
                >
                  Concluído
                </button>
              </div>

              {/* Progress Slider */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.progress}
                  onChange={(e) => updateProgress(item.id, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </LifeOSLayout>
  );
}
