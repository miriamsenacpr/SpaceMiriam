import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, Check } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  module: string;
}

interface Event {
  id: string;
  title: string;
  time: string;
  module: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Estudar para prova de Cálculo', completed: false, module: 'Faculdade' },
    { id: '2', title: 'Fazer compras de alimentos', completed: false, module: 'Casa' },
    { id: '3', title: 'Assistir aula de React', completed: true, module: 'Estudos' },
  ]);

  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Prova de Cálculo', time: '14:00', module: 'Faculdade' },
    { id: '2', title: 'Reunião de projeto', time: '16:30', module: 'Faculdade' },
    { id: '3', title: 'Limpeza da casa', time: '10:00', module: 'Casa' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        module: 'Geral'
      }]);
      setNewTask('');
      setShowAddTask(false);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <LifeOSLayout activeModule="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-lavender-400 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Bem-vinda ao LifeOS! 👋</h1>
          <p className="text-lg opacity-90">Seu segundo cérebro digital está pronto para organizar sua vida</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">{tasks.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tarefas no total</p>
          </div>
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{completedCount}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tarefas concluídas</p>
          </div>
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-3xl font-bold text-lavender-600 dark:text-lavender-400">{events.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Eventos hoje</p>
          </div>
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-3xl font-bold text-peach-600 dark:text-peach-400">{Math.round(progressPercentage)}%</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Progresso diário</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glassmorphism p-6 rounded-xl">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Progresso da Semana</h3>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-400 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {completedCount} de {tasks.length} tarefas concluídas
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Section */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">📋 Minhas Tarefas</h2>
              <Button
                size="sm"
                onClick={() => setShowAddTask(!showAddTask)}
                className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
              >
                <Plus size={16} className="mr-1" /> Nova
              </Button>
            </div>

            {showAddTask && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Digite uma nova tarefa..."
                  className="flex-1 px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={addTask}
                  className="bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Adicionar
                </Button>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Nenhuma tarefa ainda. Crie uma para começar! ✨
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-gradient-to-r from-rose-400 to-pink-500 border-pink-500'
                          : 'border-rose-300 dark:border-slate-600'
                      }`}
                    >
                      {task.completed && <Check size={14} className="text-white" />}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-xs text-rose-600 dark:text-rose-400">{task.module}</span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Events Section */}
          <div className="glassmorphism p-6 rounded-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📅 Próximos Eventos</h2>
            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Nenhum evento agendado. Crie um para organizar seu tempo! 📅
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-rose-400 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-300 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                        {event.time.split(':')[0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{event.time}</p>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-full">
                      {event.module}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glassmorphism p-6 rounded-xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">⚡ Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { emoji: '📝', label: 'Nova Tarefa', color: 'from-rose-400 to-pink-500' },
              { emoji: '📅', label: 'Novo Evento', color: 'from-lavender-400 to-purple-500' },
              { emoji: '💡', label: 'Nova Ideia', color: 'from-yellow-400 to-orange-500' },
              { emoji: '📚', label: 'Novo Livro', color: 'from-blue-400 to-cyan-500' },
            ].map((action, idx) => (
              <button
                key={idx}
                className={`p-4 bg-gradient-to-br ${action.color} rounded-lg text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{action.emoji}</div>
                <div className="text-sm">{action.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </LifeOSLayout>
  );
}
