import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import Dashboard from "./Dashboard";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-lavender-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Carregando LifeOS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
              ✨
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">LifeOS</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Seu Segundo Cérebro Digital</p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-slate-700 dark:text-slate-300">
              Organize sua vida pessoal, faculdade, casa, estudos, metas e muito mais em um único lugar.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl mb-1">🎓</div>
                <p className="font-semibold text-slate-900 dark:text-white">Faculdade</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl mb-1">🏠</div>
                <p className="font-semibold text-slate-900 dark:text-white">Casa</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl mb-1">📚</div>
                <p className="font-semibold text-slate-900 dark:text-white">Estudos</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl mb-1">🎯</div>
                <p className="font-semibold text-slate-900 dark:text-white">Metas</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-semibold py-3 rounded-lg text-lg"
          >
            Começar Agora
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
