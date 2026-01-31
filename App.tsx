
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AdminPage from './components/AdminPage';
import { LOGO_URL, VALID_CREDENTIALS } from './constants';
import { AppView, User } from './types';
import { Lock, User as UserIcon, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gabungkan kredensial statis dengan kredensial kustom dari localStorage
    const savedCustomUsers = localStorage.getItem('custom_users');
    const customCredentials = savedCustomUsers ? JSON.parse(savedCustomUsers) : [];
    
    const allValidCredentials = [...VALID_CREDENTIALS, ...customCredentials];

    const matchedUser = allValidCredentials.find(
      u => u.username === loginForm.username && u.password === loginForm.password
    );

    if (matchedUser) {
      const loggedUser: User = {
        id: (matchedUser as any).id || Math.random().toString(36).substr(2, 9),
        username: matchedUser.username,
        role: matchedUser.role,
        lastLogin: new Date().toLocaleString()
      };
      setUser(loggedUser);
      setView('dashboard');
      setLoginError('');
    } else {
      setLoginError('Username atau Password salah. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setLoginForm({ username: '', password: '' });
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <img className="mx-auto h-20 w-auto" src={LOGO_URL} alt="Logo" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
            Aplikasi Menulis Buku Non Fiksi
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Platform Penulisan Buku Non-Fiksi Berbasis AI
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-2xl rounded-2xl border border-slate-100 sm:px-12 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Username</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="appearance-none block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="appearance-none block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan password"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                  <AlertCircle size={18} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98]"
                >
                  Masuk Sekarang
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Gunakan akun terdaftar untuk mengakses fitur penulisan.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} setView={setView} onLogout={handleLogout} userRole={user?.role}>
      {view === 'dashboard' ? <Dashboard /> : <AdminPage />}
    </Layout>
  );
};

export default App;
