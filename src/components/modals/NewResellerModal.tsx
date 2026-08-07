import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, X, Coins, Percent } from 'lucide-react';

export const NewResellerModal: React.FC = () => {
  const { addReseller, setActiveModal } = useApp();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Revendedor Master' | 'Revendedor Estándar'>('Revendedor Estándar');
  const [credits, setCredits] = useState(100);
  const [demoCredits, setDemoCredits] = useState(10);
  const [commissionPercentage, setCommissionPercentage] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addReseller({
      name,
      username: username || name.toLowerCase().replace(/\s+/g, '_'),
      password: password || '123456',
      email,
      role,
      credits,
      demoCredits,
      commissionPercentage,
      status: 'active',
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-2xl glass-panel space-y-4 border border-white/10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-[var(--text)]">
            <UserCheck size={20} className="text-amber-400" />
            <span>Crear Cuenta de Revendedor</span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[var(--text-muted)] font-bold mb-1">Nombre Completo o Empresa</label>
            <input
              type="text"
              required
              placeholder="ej. Distribuidor VPN Latam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-muted)] font-bold mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="ventas@distribuidor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Nivel de Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
              >
                <option value="Revendedor Estándar">Revendedor Estándar</option>
                <option value="Revendedor Master">Revendedor Master</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Comisión (%)</label>
              <input
                type="number"
                min="5"
                max="50"
                value={commissionPercentage}
                onChange={(e) => setCommissionPercentage(parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Usuario de Acceso</label>
              <input
                type="text"
                placeholder="ej. distribuidor1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)] font-mono"
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="por defecto: 123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Créditos de Venta</label>
              <input
                type="number"
                min="0"
                max="10000"
                value={credits}
                onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] font-mono"
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Créditos Demo (Pruebas)</label>
              <input
                type="number"
                min="0"
                max="10000"
                value={demoCredits}
                onChange={(e) => setDemoCredits(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl font-bold text-[var(--text-muted)] hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-black hover:bg-amber-400 shadow-lg"
            >
              Dar de Alta Revendedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
