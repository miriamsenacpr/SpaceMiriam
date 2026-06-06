import { useState } from 'react';
import LifeOSLayout from '@/components/LifeOSLayout';
import { Button } from '@/components/ui/button';
import { Plus, X, Clock, Users } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  category: string;
  prepTime: number;
  servings: number;
  ingredients: string[];
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface WeeklyMenu {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export default function Menu() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Frango com Batata',
      category: 'Prato Principal',
      prepTime: 45,
      servings: 4,
      ingredients: ['Frango', 'Batata', 'Alho', 'Cebola', 'Azeite'],
      instructions: 'Tempere o frango, coloque em uma assadeira com batatas cortadas e leve ao forno.',
      difficulty: 'easy',
    },
    {
      id: '2',
      name: 'Salada de Quinoa',
      category: 'Salada',
      prepTime: 20,
      servings: 2,
      ingredients: ['Quinoa', 'Tomate', 'Pepino', 'Cebola roxa', 'Limão'],
      instructions: 'Cozinhe a quinoa, misture com os vegetais picados e tempere com limão.',
      difficulty: 'easy',
    },
    {
      id: '3',
      name: 'Bolo de Chocolate',
      category: 'Sobremesa',
      prepTime: 60,
      servings: 8,
      ingredients: ['Chocolate', 'Ovos', 'Açúcar', 'Farinha', 'Manteiga'],
      instructions: 'Misture os ingredientes, despeje em forma e asse a 180°C por 40 minutos.',
      difficulty: 'medium',
    },
  ]);

  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu[]>([
    { day: 'Segunda', breakfast: 'Pão com queijo', lunch: 'Frango com batata', dinner: 'Salada de quinoa' },
    { day: 'Terça', breakfast: 'Iogurte com granola', lunch: 'Arroz e feijão', dinner: 'Macarrão' },
    { day: 'Quarta', breakfast: 'Ovos mexidos', lunch: 'Peixe grelhado', dinner: 'Sopa' },
    { day: 'Quinta', breakfast: 'Frutas', lunch: 'Frango com batata', dinner: 'Pizza' },
    { day: 'Sexta', breakfast: 'Pão francês', lunch: 'Lasanha', dinner: 'Salada' },
    { day: 'Sábado', breakfast: 'Panquecas', lunch: 'Churrasco', dinner: 'Bolo de chocolate' },
    { day: 'Domingo', breakfast: 'Café da manhã reforçado', lunch: 'Feijoada', dinner: 'Sobremesa' },
  ]);

  const [showNewRecipe, setShowNewRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    category: '',
    prepTime: 30,
    servings: 2,
    ingredients: '',
    instructions: '',
    difficulty: 'easy' as const,
  });

  const categories = ['Prato Principal', 'Acompanhamento', 'Salada', 'Sobremesa', 'Bebida', 'Café da manhã'];
  const difficulties = ['easy', 'medium', 'hard'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  const addRecipe = () => {
    if (newRecipe.name.trim()) {
      setRecipes([...recipes, {
        id: Date.now().toString(),
        ...newRecipe,
        ingredients: newRecipe.ingredients.split('\n').filter(i => i.trim()),
      }]);
      setNewRecipe({
        name: '',
        category: '',
        prepTime: 30,
        servings: 2,
        ingredients: '',
        instructions: '',
        difficulty: 'easy',
      });
      setShowNewRecipe(false);
    }
  };

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  return (
    <LifeOSLayout activeModule="menu">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">🍽️ Cardápio</h1>
            <p className="text-slate-600 dark:text-slate-400">Organize receitas e planeje suas refeições</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{recipes.length}</div>
            <p className="text-sm opacity-90">Receitas salvas</p>
          </div>
          <div className="bg-gradient-to-br from-peach-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">7</div>
            <p className="text-sm opacity-90">Dias planejados</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold">{recipes.filter(r => r.difficulty === 'easy').length}</div>
            <p className="text-sm opacity-90">Receitas fáceis</p>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">📚 Minhas Receitas</h2>
            <Button
              size="sm"
              onClick={() => setShowNewRecipe(!showNewRecipe)}
              className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white"
            >
              <Plus size={16} className="mr-1" /> Nova Receita
            </Button>
          </div>

          {showNewRecipe && (
            <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-600 space-y-3">
              <input
                type="text"
                placeholder="Nome da receita"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newRecipe.category}
                  onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={newRecipe.difficulty}
                  onChange={(e) => setNewRecipe({ ...newRecipe, difficulty: e.target.value as any })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{getDifficultyLabel(d)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Tempo (minutos)"
                  value={newRecipe.prepTime}
                  onChange={(e) => setNewRecipe({ ...newRecipe, prepTime: parseInt(e.target.value) })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Porções"
                  value={newRecipe.servings}
                  onChange={(e) => setNewRecipe({ ...newRecipe, servings: parseInt(e.target.value) })}
                  className="px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <textarea
                placeholder="Ingredientes (um por linha)"
                value={newRecipe.ingredients}
                onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                rows={3}
              />
              <textarea
                placeholder="Modo de preparo"
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={addRecipe}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Salvar Receita
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowNewRecipe(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-slate-700 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{recipe.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{recipe.category}</p>
                  </div>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                </div>

                <div className="flex gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Clock size={14} />
                    <span>{recipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Users size={14} />
                    <span>{recipe.servings} porções</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(recipe.difficulty)}`}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </span>
                </div>

                <div className="text-xs">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">Ingredientes:</p>
                  <ul className="text-slate-600 dark:text-slate-400 space-y-0.5">
                    {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                      <li key={idx}>• {ing}</li>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <li>• +{recipe.ingredients.length - 3} mais</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Menu */}
        <div className="glassmorphism p-6 rounded-xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📅 Cardápio Semanal</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-200 dark:border-slate-600">
                  <th className="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white">Dia</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white">Café</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white">Almoço</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-900 dark:text-white">Jantar</th>
                </tr>
              </thead>
              <tbody>
                {weeklyMenu.map((day, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-rose-100 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{day.day}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{day.breakfast}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{day.lunch}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{day.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LifeOSLayout>
  );
}
