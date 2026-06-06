import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, Lightbulb, Search } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: '1',
      title: 'Criar um app de produtividade',
      description: 'Um aplicativo que combine todo-list, calendário e notas',
      tags: ['app', 'produtividade', 'tech'],
      category: 'Projetos',
      priority: 'high',
      createdAt: '2024-06-01',
    },
    {
      id: '2',
      title: 'Aprender machine learning',
      description: 'Estudar conceitos de ML e aplicar em projetos reais',
      tags: ['aprendizado', 'tech', 'IA'],
      category: 'Educação',
      priority: 'medium',
      createdAt: '2024-05-28',
    },
    {
      id: '3',
      title: 'Escrever um blog',
      description: 'Compartilhar conhecimento sobre desenvolvimento web',
      tags: ['escrita', 'web', 'comunidade'],
      category: 'Conteúdo',
      priority: 'low',
      createdAt: '2024-05-25',
    },
  ]);

  const [showNewIdea, setShowNewIdea] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    tags: '',
    category: '',
    priority: 'medium' as const,
  });

  const categories = ['Projetos', 'Educação', 'Conteúdo', 'Negócios', 'Pessoal', 'Criativo'];
  const allTags = Array.from(new Set(ideas.flatMap(i => i.tags)));

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

  const addIdea = () => {
    if (newIdea.title.trim()) {
      setIdeas([...ideas, {
        id: Date.now().toString(),
        title: newIdea.title,
        description: newIdea.description,
        tags: newIdea.tags.split(',').map(t => t.trim()).filter(t => t),
        category: newIdea.category,
        priority: newIdea.priority,
        createdAt: new Date().toISOString().split('T')[0],
      }]);
      setNewIdea({
        title: '',
        description: '',
        tags: '',
        category: '',
        priority: 'medium',
      });
      setShowNewIdea(false);
    }
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || idea.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <LifeOSLayout activeModule="ideas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">💡 Ideias</h1>
            <p className="text-slate-600 dark:text-slate-400">Capture e organize suas melhores ideias</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{ideas.length}</div>
            <p className="text-sm opacity-90">Ideias totais</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{ideas.filter(i => i.priority === 'high').length}</div>
            <p className="text-sm opacity-90">Ideias prioritárias</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{allTags.length}</div>
            <p className="text-sm opacity-90">Tags únicas</p>
          </div>
        </div>

        {/* Add New Idea */}
        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Captura Rápida</h2>
            <Button
              size="sm"
              onClick={() => setShowNewIdea(!showNewIdea)}
              className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
            >
              <Plus size={16} className="mr-1" /> Nova Ideia
            </Button>
          </div>

          {showNewIdea && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-600 space-y-3">
              <input
                type="text"
                placeholder="Título da ideia"
                value={newIdea.title}
                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <textarea
                placeholder="Descrição detalhada"
                value={newIdea.description}
                onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                rows={3}
              />
              <input
                type="text"
                placeholder="Tags (separadas por vírgula)"
                value={newIdea.tags}
                onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newIdea.category}
                  onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Categoria</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={newIdea.priority}
                  onChange={(e) => setNewIdea({ ...newIdea, priority: e.target.value as any })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="low">Baixa Prioridade</option>
                  <option value="medium">Média Prioridade</option>
                  <option value="high">Alta Prioridade</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={addIdea}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Salvar Ideia
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowNewIdea(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="glassmorphism p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-slate-600 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Buscar ideias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === null
                  ? 'bg-rose-400 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-rose-400 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Lightbulb size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Nenhuma ideia encontrada</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="glassmorphism p-4 rounded-xl hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-2xl mt-1">💡</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{idea.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{idea.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {idea.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {idea.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="text-xs px-2 py-1 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded hover:bg-lavender-200 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(idea.priority)}`}>
                    {idea.priority === 'high' ? '🔴' : idea.priority === 'medium' ? '🟡' : '🟢'} {idea.priority}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(idea.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </LifeOSLayout>
  );
}
