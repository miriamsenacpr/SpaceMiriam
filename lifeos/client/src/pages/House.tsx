import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, Check } from 'lucide-react';

interface HouseTask {
  id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  dueDate: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  purchased: boolean;
}

export default function House() {
  const [tasks, setTasks] = useState<HouseTask[]>([
    { id: '1', title: 'Lavar louça', category: 'Cozinha', frequency: 'daily', completed: false, dueDate: '2024-06-05' },
    { id: '2', title: 'Varrer a casa', category: 'Limpeza', frequency: 'daily', completed: true, dueDate: '2024-06-05' },
    { id: '3', title: 'Trocar lençol', category: 'Quarto', frequency: 'weekly', completed: false, dueDate: '2024-06-08' },
    { id: '4', title: 'Limpar banheiro', category: 'Banheiro', frequency: 'weekly', completed: false, dueDate: '2024-06-07' },
  ]);

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Leite', quantity: '2L', category: 'Alimentos', purchased: false },
    { id: '2', name: 'Pão', quantity: '1', category: 'Alimentos', purchased: true },
    { id: '3', name: 'Detergente', quantity: '1', category: 'Limpeza', purchased: false },
    { id: '4', name: 'Papel higiênico', quantity: '2', category: 'Higiene', purchased: false },
  ]);

  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: '', frequency: 'daily' as const });
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: '' });

  const categories = ['Cozinha', 'Limpeza', 'Quarto', 'Banheiro', 'Sala', 'Varanda'];
  const itemCategories = ['Alimentos', 'Limpeza', 'Higiene', 'Outros'];

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const toggleItem = (id: string) => {
    setShoppingItems(shoppingItems.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item));
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
      }]);
      setNewTask({ title: '', category: '', frequency: 'daily' });
      setShowNewTask(false);
    }
  };

  const addItem = () => {
    if (newItem.name.trim()) {
      setShoppingItems([...shoppingItems, {
        id: Date.now().toString(),
        ...newItem,
        purchased: false,
      }]);
      setNewItem({ name: '', quantity: '', category: '' });
      setShowNewItem(false);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const deleteItem = (id: string) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const purchasedItems = shoppingItems.filter(i => i.purchased).length;

  return (
    <LifeOSLayout activeModule="house">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">🏠 Casa</h1>
            <p className="text-slate-600 dark:text-slate-400">Organize limpeza, compras e tarefas domésticas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{completedTasks}/{tasks.length}</div>
            <p className="text-sm opacity-90">Tarefas concluídas</p>
          </div>
          <div className="bg-gradient-to-br from-lavender-400 to-purple-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{purchasedItems}/{shoppingItems.length}</div>
            <p className="text-sm opacity-90">Itens comprados</p>
          </div>
          <div className="bg-gradient-to-br from-peach-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{tasks.filter(t => t.frequency === 'daily').length}</div>
            <p className="text-sm opacity-90">Tarefas diárias</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cleaning Tasks */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">🧹 Tarefas de Limpeza</h2>
              <Button
                size="sm"
                onClick={() => setShowNewTask(!showNewTask)}
                className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
              >
                <Plus size={16} className="mr-1" /> Nova
              </Button>
            </div>

            {showNewTask && (
              <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-600 space-y-3">
                <input
                  type="text"
                  placeholder="Título da tarefa"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={newTask.frequency}
                  onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="daily">Diária</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={addTask}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Adicionar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowNewTask(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Nenhuma tarefa. Crie uma para começar! ✨
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors group"
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
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 rounded">
                          {task.category}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded">
                          {task.frequency === 'daily' ? '📅 Diária' : task.frequency === 'weekly' ? '📆 Semanal' : '📊 Mensal'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Shopping List */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">🛒 Lista de Compras</h2>
              <Button
                size="sm"
                onClick={() => setShowNewItem(!showNewItem)}
                className="bg-gradient-to-r from-lavender-400 to-purple-500 hover:from-lavender-500 hover:to-purple-600 text-white"
              >
                <Plus size={16} className="mr-1" /> Novo
              </Button>
            </div>

            {showNewItem && (
              <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-lavender-200 dark:border-slate-600 space-y-3">
                <input
                  type="text"
                  placeholder="Nome do item"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-lavender-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Quantidade"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-lavender-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-lavender-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {itemCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={addItem}
                    className="flex-1 bg-lavender-500 hover:bg-lavender-600 text-white"
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

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {shoppingItems.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Nenhum item. Adicione itens à sua lista! 🛒
                </p>
              ) : (
                shoppingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-lavender-50 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.purchased
                          ? 'bg-gradient-to-r from-lavender-400 to-purple-500 border-purple-500'
                          : 'border-lavender-300 dark:border-slate-600'
                      }`}
                    >
                      {item.purchased && <Check size={14} className="text-white" />}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          item.purchased
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {item.quantity}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </LifeOSLayout>
  );
}
