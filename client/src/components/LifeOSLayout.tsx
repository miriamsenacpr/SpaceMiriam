import { useState } from 'react';
import { Menu, X, Moon, Sun, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';

interface LifeOSLayoutProps {
  children: React.ReactNode;
  activeModule?: string;
}

export default function LifeOSLayout({ children, activeModule = 'dashboard' }: LifeOSLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'college', label: 'Faculdade', icon: '🎓' },
    { id: 'house', label: 'Casa', icon: '🏠' },
    { id: 'menu', label: 'Cardápio', icon: '🍽️' },
    { id: 'movies', label: 'Filmes & Séries', icon: '🎬' },
    { id: 'studies', label: 'Estudos', icon: '📚' },
    { id: 'goals', label: 'Metas', icon: '🎯' },
    { id: 'ideas', label: 'Ideias', icon: '💡' },
    { id: 'library', label: 'Biblioteca', icon: '📖' },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-rose-50 to-lavender-50 dark:from-slate-900 dark:to-slate-800 border-r border-rose-200 dark:border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-rose-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                ✨
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-rose-700 dark:text-rose-300">LifeOS</h1>
                  <p className="text-xs text-rose-600 dark:text-rose-400">Seu Cérebro Digital</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-rose-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {modules.map((module) => (
            <a
              key={module.id}
              href={`/${module.id}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === module.id
                  ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-xl">{module.icon}</span>
              {sidebarOpen && <span className="font-medium">{module.label}</span>}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-rose-200 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {sidebarOpen && <span className="text-sm">{darkMode ? 'Claro' : 'Escuro'}</span>}
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-white via-rose-50 to-lavender-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-rose-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {modules.find((m) => m.id === activeModule)?.label || 'LifeOS'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-slate-700 rounded-lg">
              <User size={18} className="text-rose-600 dark:text-rose-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user?.email || 'Usuário'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
