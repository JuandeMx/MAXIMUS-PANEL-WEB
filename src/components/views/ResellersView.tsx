import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Reseller } from '../../types';
import {
  UserCheck,
  Plus,
  Coins,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  Edit,
  Trash2,
  Users,
} from 'lucide-react';

export const ResellersView: React.FC = () => {
  const {
    resellers,
    usersList,
    currentUser,
    addResellerCredits,
    setActiveModal,
    setSelectedAdmin,
    setSelectedReseller,
    deleteSystemAdmin,
    searchQuery,
    setSearchQuery,
    addAuditLog,
  } = useApp();
  const [creditModalReseller, setCreditModalReseller] = useState<Reseller | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(100);
  const [demoCreditAmount, setDemoCreditAmount] = useState<number>(10);
  const [activeSubTab, setActiveSubTab] = useState<'resellers' | 'admins'>('resellers');

  const safeResellers = resellers || [];
  const safeUsersList = usersList || [];
  const q = (searchQuery || '').toLowerCase();

  const filteredResellers = safeResellers.filter(
    (r) =>
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.role && r.role.toLowerCase().includes(q))
  );

  const filteredAdmins = safeUsersList.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q))
  );

  const handleAddCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creditModalReseller && (creditAmount >= 0 || demoCreditAmount >= 0)) {
      addResellerCredits(creditModalReseller.id, creditAmount, demoCreditAmount);
      setCreditModalReseller(null);
      setCreditAmount(100);
      setDemoCreditAmount(10);
    }
  };

  const handleDeleteAdmin = async (u: any) => {
    if (u.role === 'owner') {
      alert('No es posible eliminar al Administrador Principal del Sistema.');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar al Administrador "${u.name}" (@${u.username})?`)) {
      await deleteSystemAdmin(u.id);
      addAuditLog(`Eliminado Administrador "${u.name}"`, 'Security', 'warning');
    }
  };

  const handleEditAdmin = (u: any) => {
    setSelectedAdmin(u);
    setActiveModal('edit-admin');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <UserCheck size={22} className="text-amber-400" />
            <span>Gestión de Revendedores & Administradores</span>
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">
            Administra sub-distribuidores, administradores y recargas de saldo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'owner' && (
            <button
              onClick={() => setActiveModal('new-admin')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={16} />
              <span>Añadir Administrador</span>
            </button>
          )}

          <button
            onClick={() => setActiveModal('new-reseller')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-lg transition-all flex items-center gap-2"
          >
            <UserPlus size={16} />
            <span>Nuevo Revendedor</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSubTab('resellers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'resellers'
              ? 'bg-[var(--accent)] text-[var(--accent-fg)] shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
          }`}
        >
          Revendedores ({safeResellers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('admins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'admins'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Administradores ({safeUsersList.length})</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-subtle)] uppercase">Créditos Circulantes</p>
            <p className="text-xl font-black text-[var(--text)]">
              {safeResellers.reduce((acc, r) => acc + (r.credits || 0), 0)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-subtle)] uppercase">Ventas Acumuladas</p>
            <p className="text-xl font-black text-[var(--text)]">
              ${safeResellers.reduce((acc, r) => acc + (r.totalSales || 0), 0).toLocaleString()} USD
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-subtle)] uppercase">Cuentas Administradas</p>
            <p className="text-xl font-black text-[var(--text)]">
              {safeResellers.reduce((acc, r) => acc + (r.activeClientsCount || 0), 0)} VPN Users
            </p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeSubTab === 'resellers' ? (
            filteredResellers.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <UserCheck size={36} className="mx-auto text-amber-400/40" />
                <p className="text-sm font-bold text-[var(--text)]">No hay revendedores registrados</p>
                <p className="text-xs text-[var(--text-subtle)]">Haz clic en el botón "+ Crear Revendedor" en la esquina superior derecha para dar de alta tu primer distribuidor.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[var(--text-subtle)] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Revendedor</th>
                    <th className="py-3.5 px-4">Rol</th>
                    <th className="py-3.5 px-4">Créditos Venta</th>
                    <th className="py-3.5 px-4">Créditos Demos</th>
                    <th className="py-3.5 px-4">Clientes VPN</th>
                    <th className="py-3.5 px-4">Ventas Totales</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredResellers.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {r.avatar || (r.name || 'RV').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text)]">{r.name || 'Revendedor'}</p>
                            <p className="text-[10px] text-[var(--text-subtle)]">{r.email || ''}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[10px]">
                          {r.role || 'Revendedor Estándar'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-amber-400 flex items-center gap-1 text-sm">
                          <Coins size={14} />
                          {r.credits || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-cyan-300 flex items-center gap-1 text-sm">
                          <Coins size={14} />
                          {r.demoCredits || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[var(--text)]">
                        {r.activeClientsCount || 0} usuarios
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ${(r.totalSales || 0).toLocaleString()} USD
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {r.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedReseller(r);
                            setActiveModal('reseller-clients');
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all inline-flex items-center gap-1 border border-cyan-500/30"
                          title="Ver usuarios creados por este revendedor"
                        >
                          <Users size={13} />
                          <span>Ver Usuarios</span>
                        </button>
                        <button
                          onClick={() => setCreditModalReseller(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all inline-flex items-center gap-1 border border-amber-500/30"
                        >
                          <Plus size={13} />
                          <span>Recargar Créditos</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            filteredAdmins.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <ShieldCheck size={36} className="mx-auto text-cyan-400/40" />
                <p className="text-sm font-bold text-[var(--text)]">No hay otros administradores registrados</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[var(--text-subtle)] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Administrador</th>
                    <th className="py-3.5 px-4">Usuario</th>
                    <th className="py-3.5 px-4">Rol del Sistema</th>
                    <th className="py-3.5 px-4">Fecha Registro</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAdmins.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {(u.name || 'AD').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text)]">{u.name || u.username}</p>
                            <p className="text-[10px] text-[var(--text-subtle)]">{u.email || ''}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-cyan-300 font-bold">
                        @{u.username}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[var(--text-muted)]">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${u.role === 'owner' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}`}>
                          {u.role === 'owner' ? 'PROPIETARIO MAESTRO' : 'SUB-ADMINISTRADOR'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Reciente'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          Activo
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditAdmin(u)}
                          className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                          title="Editar Administrador / Contraseña"
                        >
                          <Edit size={14} />
                        </button>
                        {u.role !== 'owner' && (
                          <button
                            onClick={() => handleDeleteAdmin(u)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Eliminar Administrador"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {/* Local Credit Assignment Modal */}
      {creditModalReseller && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel space-y-4 border border-amber-500/30 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <Coins size={20} className="text-amber-400" />
              <span>Asignar Créditos a {creditModalReseller.name}</span>
            </h3>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Saldo Venta Actual</p>
                <p className="font-bold text-amber-400 text-sm">{creditModalReseller.credits || 0} créditos</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Saldo Demos Actual</p>
                <p className="font-bold text-cyan-300 text-sm">{creditModalReseller.demoCredits || 0} demos</p>
              </div>
            </div>

            <form onSubmit={handleAddCreditsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Créditos Oficiales de Venta
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Créditos de Pruebas / Demos (24h - 48h)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={demoCreditAmount}
                  onChange={(e) => setDemoCreditAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCreditModalReseller(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400"
                >
                  Confirmar Recarga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
