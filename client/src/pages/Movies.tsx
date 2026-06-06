import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, Star } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'documentary';
  platform: string;
  status: 'watching' | 'watched' | 'pending';
  rating: number;
  category: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([
    { id: '1', title: 'Inception', type: 'movie', platform: 'Netflix', status: 'watched', rating: 5, category: 'Ficção Científica' },
    { id: '2', title: 'Stranger Things', type: 'series', platform: 'Netflix', status: 'watching', rating: 4, category: 'Drama' },
    { id: '3', title: 'The Crown', type: 'series', platform: 'Netflix', status: 'pending', rating: 0, category: 'Drama' },
    { id: '4', title: 'Our Planet', type: 'documentary', platform: 'Netflix', status: 'watched', rating: 5, category: 'Natureza' },
  ]);

  const [showNewMovie, setShowNewMovie] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    type: 'movie' as const,
    platform: '',
    status: 'pending' as const,
    rating: 0,
    category: '',
  });

  const platforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Paramount+', 'Globoplay'];
  const categories = ['Ficção Científica', 'Drama', 'Comédia', 'Ação', 'Terror', 'Romance', 'Natureza', 'Documentário'];
  const types = [
    { value: 'movie', label: 'Filme' },
    { value: 'series', label: 'Série' },
    { value: 'documentary', label: 'Documentário' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'watched':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'watching':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'watched':
        return '✅ Assistido';
      case 'watching':
        return '▶️ Assistindo';
      case 'pending':
        return '⏳ Pendente';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'series':
        return '📺';
      case 'documentary':
        return '🎥';
      default:
        return '📽️';
    }
  };

  const addMovie = () => {
    if (newMovie.title.trim()) {
      setMovies([...movies, {
        id: Date.now().toString(),
        ...newMovie,
      }]);
      setNewMovie({
        title: '',
        type: 'movie',
        platform: '',
        status: 'pending',
        rating: 0,
        category: '',
      });
      setShowNewMovie(false);
    }
  };

  const deleteMovie = (id: string) => {
    setMovies(movies.filter(m => m.id !== id));
  };

  const updateMovieRating = (id: string, rating: number) => {
    setMovies(movies.map(m => m.id === id ? { ...m, rating } : m));
  };

  const updateMovieStatus = (id: string, status: 'watching' | 'watched' | 'pending') => {
    setMovies(movies.map(m => m.id === id ? { ...m, status } : m));
  };

  const watchedCount = movies.filter(m => m.status === 'watched').length;
  const watchingCount = movies.filter(m => m.status === 'watching').length;
  const pendingCount = movies.filter(m => m.status === 'pending').length;

  return (
    <LifeOSLayout activeModule="movies">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">🎬 Filmes & Séries</h1>
            <p className="text-slate-600 dark:text-slate-400">Organize suas produções favoritas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{movies.length}</div>
            <p className="text-sm opacity-90">Total de produções</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{watchedCount}</div>
            <p className="text-sm opacity-90">Assistidas</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{watchingCount}</div>
            <p className="text-sm opacity-90">Assistindo</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{pendingCount}</div>
            <p className="text-sm opacity-90">Pendentes</p>
          </div>
        </div>

        {/* Add New Movie */}
        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Adicionar Produção</h2>
            <Button
              size="sm"
              onClick={() => setShowNewMovie(!showNewMovie)}
              className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
            >
              <Plus size={16} className="mr-1" /> Nova
            </Button>
          </div>

          {showNewMovie && (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-600 space-y-3">
              <input
                type="text"
                placeholder="Título"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newMovie.type}
                  onChange={(e) => setNewMovie({ ...newMovie, type: e.target.value as any })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {types.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <select
                  value={newMovie.platform}
                  onChange={(e) => setNewMovie({ ...newMovie, platform: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Plataforma</option>
                  {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <select
                value={newMovie.category}
                onChange={(e) => setNewMovie({ ...newMovie, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Categoria</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={addMovie}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Adicionar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowNewMovie(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="glassmorphism p-4 rounded-xl hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(movie.type)}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{movie.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{movie.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMovie(movie.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                >
                  <X size={14} className="text-red-500" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Plataforma:</span>
                  <span className="text-xs px-2 py-1 bg-lavender-100 dark:bg-lavender-900 text-lavender-700 dark:text-lavender-300 rounded">
                    {movie.platform}
                  </span>
                </div>

                <div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(movie.status)}`}>
                    {getStatusLabel(movie.status)}
                  </span>
                </div>

                {/* Status Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMovieStatus(movie.id, 'pending')}
                    className={`flex-1 text-xs py-1 rounded transition-colors ${
                      movie.status === 'pending'
                        ? 'bg-yellow-400 text-white'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200'
                    }`}
                  >
                    Pendente
                  </button>
                  <button
                    onClick={() => updateMovieStatus(movie.id, 'watching')}
                    className={`flex-1 text-xs py-1 rounded transition-colors ${
                      movie.status === 'watching'
                        ? 'bg-blue-400 text-white'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
                    }`}
                  >
                    Assistindo
                  </button>
                  <button
                    onClick={() => updateMovieStatus(movie.id, 'watched')}
                    className={`flex-1 text-xs py-1 rounded transition-colors ${
                      movie.status === 'watched'
                        ? 'bg-green-400 text-white'
                        : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200'
                    }`}
                  >
                    Assistido
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateMovieRating(movie.id, star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={16}
                        className={star <= movie.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LifeOSLayout>
  );
}
