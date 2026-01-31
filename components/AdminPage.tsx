
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Settings as SettingsIcon, 
  Search, 
  ShieldCheck, 
  X, 
  Shield, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Save,
  Loader2,
  UserPlus,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../types';
import { VALID_CREDENTIALS } from '../constants';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'results' | 'settings'>('users');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showToast, setShowToast] = useState<{show: boolean, message: string}>({ show: false, message: '' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  });

  const [settings, setSettings] = useState({
    appName: 'Aplikasi Menulis Buku Non Fiksi',
    adminEmail: 'admin@bookwriter.pro',
    apiStatus: 'Aktif'
  });

  // Load users on mount
  useEffect(() => {
    const loadUsers = () => {
      const savedCustomUsers = localStorage.getItem('custom_users');
      const customUsers = savedCustomUsers ? JSON.parse(savedCustomUsers) : [];
      
      const initialUsers: User[] = [
        ...VALID_CREDENTIALS.map((u, index) => ({
          id: `static-${index}`,
          username: u.username,
          role: u.role,
          lastLogin: index === 0 ? '2023-11-20 08:30' : '-',
          password: u.password
        })),
        ...customUsers.map((u: any) => ({
          id: u.id,
          username: u.username,
          role: u.role,
          lastLogin: '-',
          password: u.password
        }))
      ];
      setUsers(initialUsers);
    };

    loadUsers();
  }, []);

  const triggerToast = (message: string) => {
    setShowToast({ show: true, message });
    setTimeout(() => setShowToast({ show: false, message: '' }), 3000);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;

    const newId = Date.now().toString();
    const userObject = {
      id: newId,
      username: newUser.username,
      password: newUser.password,
      role: newUser.role
    };

    // Save to localStorage for login persistence
    const savedCustomUsers = localStorage.getItem('custom_users');
    const customUsers = savedCustomUsers ? JSON.parse(savedCustomUsers) : [];
    localStorage.setItem('custom_users', JSON.stringify([...customUsers, userObject]));

    // Update local state
    setUsers([...users, { ...userObject, lastLogin: '-' }]);
    setNewUser({ username: '', password: '', role: 'user' });
    setIsAddUserModalOpen(false);
    triggerToast('Pengguna baru berhasil ditambahkan dan dapat login!');
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
    setUsers(updatedUsers);

    // Update custom users in localStorage
    const savedCustomUsers = localStorage.getItem('custom_users');
    if (savedCustomUsers) {
      const customUsers = JSON.parse(savedCustomUsers);
      const updatedCustom = customUsers.map((u: any) => 
        u.id === editingUser.id ? { 
          ...u, 
          role: editingUser.role, 
          password: editingUser.password || u.password 
        } : u
      );
      localStorage.setItem('custom_users', JSON.stringify(updatedCustom));
    }

    setIsEditUserModalOpen(false);
    setEditingUser(null);
    triggerToast('Data pengguna berhasil diperbarui!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      triggerToast('Pengaturan sistem berhasil disimpan!');
    }, 1000);
  };

  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setIsEditUserModalOpen(true);
  };

  const deleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      setUsers(users.filter(u => u.id !== id));
      
      const savedCustomUsers = localStorage.getItem('custom_users');
      if (savedCustomUsers) {
        const customUsers = JSON.parse(savedCustomUsers);
        localStorage.setItem('custom_users', JSON.stringify(customUsers.filter((u: any) => u.id !== id)));
      }
      
      triggerToast('Pengguna berhasil dihapus.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {showToast.show && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-semibold">{showToast.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={20} />
                Panel Admin
              </h2>
            </div>
            <nav className="p-2 space-y-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users size={18} />
                Data Pengguna
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'results' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText size={18} />
                Hasil Menulis Buku
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <SettingsIcon size={18} />
                Pengaturan
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-grow space-y-6">
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-bold text-slate-800">Manajemen Pengguna</h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Cari user..."
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
                    />
                  </div>
                  <button 
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                  >
                    <UserPlus size={16} />
                    Tambah User
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Username</th>
                      <th className="px-6 py-4 font-semibold">Password</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Login Terakhir</th>
                      <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{u.username}</td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-500">
                          <div className="flex items-center gap-2">
                            <span>{showPasswords[u.id] ? u.password : '••••••••'}</span>
                            <button 
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {showPasswords[u.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role === 'admin' ? 'Administrator' : 'Penulis'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{u.lastLogin}</td>
                        <td className="px-6 py-4 text-sm text-right flex justify-end gap-3">
                          <button 
                            onClick={() => openEditModal(u)}
                            className="text-blue-600 hover:text-blue-800 font-medium p-1 hover:bg-blue-50 rounded"
                            title="Edit User"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="text-red-600 hover:text-red-800 font-medium p-1 hover:bg-red-50 rounded"
                            title="Hapus Pengguna"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-12 text-center">
              <FileText className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada naskah yang disimpan</h3>
              <p className="text-slate-500">Hasil penulisan buku oleh pengguna akan muncul di sini.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Pengaturan Sistem</h3>
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Aplikasi</label>
                  <input 
                    type="text" 
                    value={settings.appName} 
                    onChange={(e) => setSettings({...settings, appName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Administrasi</label>
                  <input 
                    type="email" 
                    value={settings.adminEmail} 
                    onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSavingSettings}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-slate-400"
                  >
                    {isSavingSettings ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <UserPlus size={18} className="text-blue-600" />
                Tambah Pengguna Baru
              </h3>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Masukkan username"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Masukkan password baru"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role / Peran</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as 'user' | 'admin'})}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white appearance-none transition-all"
                  >
                    <option value="user">Penulis (User)</option>
                    <option value="admin">Administrator (Admin)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-grow px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-grow px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Edit2 size={18} className="text-blue-600" />
                Edit Data Pengguna
              </h3>
              <button 
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    readOnly
                    value={editingUser.username}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password Baru</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    placeholder="Masukkan password baru"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role / Peran</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'user' | 'admin'})}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white appearance-none transition-all"
                  >
                    <option value="user">Penulis (User)</option>
                    <option value="admin">Administrator (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="flex-grow px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-grow px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
