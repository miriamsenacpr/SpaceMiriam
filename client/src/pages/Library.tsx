import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, BookMarked } from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  type: 'book' | 'article' | 'pdf' | 'video' | 'link';
  source: string;
  category: string;
  status: 'pending' | 'reading' | 'completed';
  tags: string[];
  addedDate: string;
}

export default function Library() {
  const [items, setItems] = useState<LibraryItem[]>([
    {
      id: '1',
      title: 'Clean Code',
      type: 'book',
      source: 'Robert C. Martin',
      category: 'Programação',
      status: 'reading',
      tags: ['código', 'best-practices'],
      addedDate: '2024-05-20',
    },
    {
      id: '2',
      title: 'React Patterns',
      type: 'article',
      source: 'Dev.to',
      category: 'React',
      status: 'pending',
      tags: ['react', 'frontend'],
      addedDate: '2024-06-01',
    },
    {
      id: '3',
      title: 'Design System Guide',
      type: 'pdf',
      source: 'Figma Community',
      category: 'Design',
      status: 'completed',
      tags: ['design', 'ui'],
      addedDate: '2024-05-15',
    },
  ]);

  const [showNewItem, setShowNewItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'book' as const,
    source: '',
    category: '',
    status: 'pending' as const,
    tags: '',
  });

  const types = [
    { value: 'book', label: 'Livro', icon: '📚' },
    { value: 'article', label: 'Artigo', icon: '📰' },
    { value: 'pdf', label: 'PDF', icon: '📄' },
    { value: 'video', label: 'Vídeo', icon: '🎥' },
    { value: 'link', label: 'Link', icon: '🔗' },
  ];

  const categories = ['Programação', 'React', 'Design', 'Negócios', 'Produtividade', 'Ficção', 'Educação'];

  const getTypeIcon = (type: string) => {
    return types.find(t => t.value === type)?.icon || '📖';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'reading':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅ Concluído';
      case 'reading':
        return '📖 Lendo';
      case 'pending':
        return '⏳ Pendente';
      default:
        return status;
    }
  };

  const addItem = () => {
    if (newItem.title.trim()) {
      setItems([...items, {
        id: Date.now().toString(),
        title: newItem.title,
        type: newItem.type,
        source: newItem.source,
        category: newItem.category,
        status: newItem.status,
        tags: newItem.tags.split(',').map(t => t.trim()).filter(t => t),
        addedDate: new Date().toISOString().split('T')[0],
      }]);
      setNewItem({
        title: '',
        type: 'book',
        source: '',
        category: '',
        status: 'pending',
        tags: '',
      });
      setShowNewItem(false);
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateStatus = (id: string, status: 'pending' | 'reading' | 'completed') => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const pendingCount = items.filter(i => i.status === 'pending').length;
  const readingCount = items.filter(i => i.status === 'reading').length;
  const completedCount = items.filter(i => i.status === 'completed').length;

  return (
    <LifeOSLayout activeModule="library">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">📖 Biblioteca</h1>
            <p className="text-slate-600 dark:text-slate-400">Organize seus livros, artigos e conteúdos para ler</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{items.length}</div>
            <p className="text-sm opacity-90">Itens totais</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{pendingCount}</div>
            <p className="text-sm opacity-90">Pendentes</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{readingCount}</div>
            <p className="text-sm opacity-90">Lendo</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{completedCount}</div>
            <p className="text-sm opacity-90">Concluídos</p>
          </div>
        </div>

        {/* Add New Item */}
        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Adicionar Item</h2>
            <Button
              size="sm"
              onClick={() => setShowNewItem(!showNewItem)}
              className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
            >
              <Plus size={16} className="mr-1" /> Novo Item
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
                type="text"
                placeholder="Fonte/Autor"
                value={newItem.source}
                onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Tags (separadas por vírgula)"
                value={newItem.tags}
                onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
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
          {items.length === 0 ? (
            <div className="text-center py-12 glassmorphism rounded-xl">
              <BookMarked size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Nenhum item na biblioteca</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="glassmorphism p-4 rounded-xl hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.source}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded">
                          {item.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
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

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(item.id, 'pending')}
                    className={`flex-1 text-xs py-1 rounded transition-colors ${
                      item.status === 'pending'
                        ? 'bg-yellow-400 text-white'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200'
                    }`}
                  >
                    Pendente
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'reading')}
                    className={`flex-1 text-xs py-1 rounded transition-colors ${
                      item.status === 'reading'
                        ? 'bg-blue-400 text-white'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
                    }`}
                  >
                    Lendo
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

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Adicionado: {new Date(item.addedDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </LifeOSLayout>
  );
}
