import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, User, Mail, Lock, UserPlus } from 'lucide-react';

export const NewAdminModal: React.FC = () => {
  const { setActiveModal, addSystemAdmin, addAuditLog } = useApp();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !name) {
      setError('Por favor completa los campos requeridos.');
      return;
    }

    setLoading(true);
    setError(null);

    const success = await addSystemAdmin({
      username,
      name,
      email,
      password: password || 'admin123',
    });

    if (success) {
      addAuditLog(`Registrado nuevo Sub-Administrador "${name}" (@${username})`, 'Security', 'success');
      setActiveModal(null);
    } else {
      setError('No se pudo crear el Administrador. Intenta nuevamente.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl glass-panel border border-cyan-500/30 p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">Añadir Nuevo Administrador</h2>
              <p className="text-xs text-[var(--text-subtle)]">
                Otorga acceso total al panel, servidores VPS y clientes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Carlos Mendoza"
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-cyan-400 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="carlos_admin"
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-cyan-400 transition-all font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@maximus.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-cyan-400 transition-all font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Defecto: admin123"
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-cyan-400 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">
              Si la dejas en blanco, la contraseña inicial será: <code className="text-cyan-400 font-mono">admin123</code>
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-lg shadow-cyan-400/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UserPlus size={15} />
              <span>{loading ? 'Guardando...' : 'Crear Administrador'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
