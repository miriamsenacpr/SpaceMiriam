import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, Target } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  period: 'yearly' | 'quarterly' | 'monthly' | 'weekly';
  category: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Aprender React avançado',
      period: 'yearly',
      category: 'Desenvolvimento',
      progress: 70,
      status: 'in-progress',
      dueDate: '2024-12-31',
    },
    {
      id: '2',
      title: 'Ler 12 livros',
      period: 'yearly',
      category: 'Leitura',
      progress: 25,
      status: 'in-progress',
      dueDate: '2024-12-31',
    },
    {
      id: '3',
      title: 'Fazer exercício 3x por semana',
      period: 'weekly',
      category: 'Saúde',
      progress: 60,
      status: 'in-progress',
      dueDate: '2024-06-09',
    },
    {
      id: '4',
      title: 'Economizar R$ 1000',
      period: 'monthly',
      category: 'Finanças',
      progress: 40,
      status: 'in-progress',
      dueDate: '2024-06-30',
    },
  ]);

  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    period: 'yearly' as const,
    category: '',
    progress: 0,
    status: 'pending' as const,
    dueDate: '',
  });

  const periods = [
    { value: 'yearly', label: 'Anual' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'weekly', label: 'Semanal' },
  ];

  const categories = ['Desenvolvimento', 'Leitura', 'Saúde', 'Finanças', 'Relacionamentos', 'Hobbies', 'Educação'];

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'yearly':
        return 'from-purple-400 to-pink-500';
      case 'quarterly':
        return 'from-blue-400 to-cyan-500';
      case 'monthly':
        return 'from-rose-400 to-pink-500';
      case 'weekly':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getPeriodLabel = (period: string) => {
    return periods.find(p => p.value === period)?.label || period;
  };

  const addGoal = () => {
    if (newGoal.title.trim() && newGoal.dueDate) {
      setGoals([...goals, {
        id: Date.now().toString(),
        ...newGoal,
      }]);
      setNewGoal({
        title: '',
        period: 'yearly',
        category: '',
        progress: 0,
        status: 'pending',
        dueDate: '',
      });
      setShowNewGoal(false);
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g));
  };

  const updateStatus = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    setGoals(goals.map(g => g.id === id ? { ...g, status, progress: status === 'completed' ? 100 : g.progress } : g));
  };

  const groupedGoals = {
    yearly: goals.filter(g => g.period === 'yearly'),
    quarterly: goals.filter(g => g.period === 'quarterly'),
    monthly: goals.filter(g => g.period === 'monthly'),
    weekly: goals.filter(g => g.period === 'weekly'),
  };

  const completedCount = goals.filter(g => g.status === 'completed').length;
  const averageProgress = goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0;

  return (
    <LifeOSLayout activeModule="goals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">🎯 Metas</h1>
            <p className="text-slate-600 dark:text-slate-400">Defina e acompanhe suas metas pessoais</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{goals.length}</div>
            <p className="text-sm opacity-90">Metas totais</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{goals.filter(g => g.status === 'in-progress').length}</div>
            <p className="text-sm opacity-90">Em progresso</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{completedCount}</div>
            <p className="text-sm opacity-90">Concluídas</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{averageProgress}%</div>
            <p className="text-sm opacity-90">Progresso médio</p>
          </div>
        </div>

        {/* Add New Goal */}
        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Adicionar Meta</h2>
            <Button
              size="sm"
              onClick={() => setShowNewGoal(!showNewGoal)}
              className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
            >
              <Plus size={16} className="mr-1" /> Nova Meta
            </Button>
          </div>

          {showNewGoal && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-600 space-y-3">
              <input
                type="text"
                placeholder="Título da meta"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newGoal.period}
                  onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value as any })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {periods.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Categoria</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <input
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={addGoal}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Adicionar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowNewGoal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Goals by Period */}
        {Object.entries(groupedGoals).map(([period, periodGoals]) => (
          periodGoals.length > 0 && (
            <div key={period} className="glassmorphism p-6 rounded-xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {getPeriodLabel(period)} ({periodGoals.length})
              </h2>
              <div className="space-y-3">
                {periodGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-rose-400 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{goal.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded">
                            {goal.category}
                          </span>
                          <span className={`text-xs px-2 py-1 bg-gradient-to-r ${getPeriodColor(goal.period)} text-white rounded`}>
                            {getPeriodLabel(goal.period)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Progresso</span>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-400 to-pink-500 h-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(goal.id, 'pending')}
                        className={`flex-1 text-xs py-1 rounded transition-colors ${
                          goal.status === 'pending'
                            ? 'bg-slate-400 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        Pendente
                      </button>
                      <button
                        onClick={() => updateStatus(goal.id, 'in-progress')}
                        className={`flex-1 text-xs py-1 rounded transition-colors ${
                          goal.status === 'in-progress'
                            ? 'bg-blue-400 text-white'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
                        }`}
                      >
                        Em Progresso
                      </button>
                      <button
                        onClick={() => updateStatus(goal.id, 'completed')}
                        className={`flex-1 text-xs py-1 rounded transition-colors ${
                          goal.status === 'completed'
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
                        value={goal.progress}
                        onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Due Date */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      📅 Vencimento: {new Date(goal.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </LifeOSLayout>
  );
}
