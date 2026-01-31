
import React from 'react';
import { LOGO_URL, APP_NAME, DEVELOPER_INFO } from '../constants';
import { LogOut, User as UserIcon, Settings, BookOpen, Database } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  userRole?: 'admin' | 'user';
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, onLogout, userRole }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="h-10 w-auto sm:h-12" />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight leading-none">
                  {APP_NAME}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">
                  {DEVELOPER_INFO}
                </span>
              </div>
            </div>
            
            <nav className="flex items-center gap-2 sm:gap-4">
              {currentView !== 'login' && (
                <>
                  <button
                    onClick={() => setView('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen size={18} />
                    <span className="hidden sm:inline">Menulis</span>
                  </button>
                  
                  {userRole === 'admin' && (
                    <button
                      onClick={() => setView('admin')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentView === 'admin' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Database size={18} />
                      <span className="hidden sm:inline">Admin</span>
                    </button>
                  )}
                  
                  <div className="h-6 w-px bg-slate-200 mx-1 sm:mx-2"></div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-medium">
            {DEVELOPER_INFO}
          </p>
          <p className="text-slate-400 text-xs mt-2">
            &copy; {new Date().getFullYear()} Aplikasi Menulis Buku Non Fiksi. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
