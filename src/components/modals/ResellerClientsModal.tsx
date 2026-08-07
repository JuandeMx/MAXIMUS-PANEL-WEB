import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, Trash2, Calendar, Shield, Clock } from 'lucide-react';

export const ResellerClientsModal: React.FC = () => {
  const {
    selectedReseller,
    setSelectedReseller,
    setActiveModal,
    clients,
    deleteVpnClient,
    addAuditLog,
  } = useApp();

  if (!selectedReseller) return null;

  const resellerClients = clients.filter((c) => c.resellerId === selectedReseller.id);

  const handleDeleteClient = (c: any) => {
    if (confirm(`¿Estás seguro de eliminar al usuario VPN "${c.username}" del revendedor "${selectedReseller.name}"?`)) {
      deleteVpnClient(c.id);
      addAuditLog(`Eliminado cliente "${c.username}" del revendedor ${selectedReseller.name}`, 'Security', 'warning');
    }
  };

  const handleClose = () => {
    setSelectedReseller(null);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl glass-panel border border-amber-500/30 p-6 space-y-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 font-bold">
              {selectedReseller.avatar}
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">
                Clientes de <span className="text-amber-400">{selectedReseller.name}</span>
              </h2>
              <p className="text-xs text-[var(--text-subtle)]">
                Gestión y cancelación de los usuarios VPN registrados por este revendedor.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <p className="text-[10px] text-slate-400 font-semibold">Total Clientes</p>
            <p className="text-lg font-bold text-white mt-0.5">{resellerClients.length} usuarios</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <p className="text-[10px] text-slate-400 font-semibold">Saldo Venta</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">{selectedReseller.credits || 0} créditos</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs col-span-2 sm:col-span-1">
            <p className="text-[10px] text-slate-400 font-semibold">Saldo Demos</p>
            <p className="text-lg font-bold text-cyan-300 mt-0.5">{selectedReseller.demoCredits || 0} demos</p>
          </div>
        </div>

        {/* Clients Table */}
        <div className="flex-1 overflow-y-auto border border-white/10 rounded-2xl">
          {resellerClients.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Users size={32} className="mx-auto text-slate-600" />
              <p className="text-xs font-bold text-slate-400">Este revendedor no tiene clientes registrados</p>
              <p className="text-[11px] text-slate-500">Sus clientes aparecerán aquí cuando registre usuarios desde su cuenta.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[var(--text-subtle)] font-bold uppercase tracking-wider sticky top-0 bg-[#0f172a]">
                  <th className="py-3 px-4">Usuario VPN</th>
                  <th className="py-3 px-4">Protocolo</th>
                  <th className="py-3 px-4">Vencimiento</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {resellerClients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-[var(--text)] font-mono">
                      {c.username}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                        {c.protocol}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300 flex items-center gap-1.5 pt-4">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{c.expirationDate}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {c.status === 'active' || c.status === 'online' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteClient(c)}
                        className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1 text-xs font-bold"
                        title="Cancelar o eliminar usuario"
                      >
                        <Trash2 size={14} />
                        <span>Cancelar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
