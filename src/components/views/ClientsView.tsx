import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProtocolType, UserStatus, VpnClient } from '../../types';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  QrCode,
  Copy,
  Clock,
  Trash2,
  Power,
  RefreshCw,
  Check,
  Shield,
  Server,
  Zap,
  Edit,
  X,
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const {
    clients,
    servers,
    searchQuery,
    setSearchQuery,
    setActiveModal,
    setSelectedClient,
    deleteVpnClient,
    toggleClientStatus,
    extendClientExpiration,
    removeUserFromNode,
    currentUser,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<VpnClient | null>(null);

  const isReseller = currentUser?.role === 'reseller';

  const filteredClients = clients.filter((client) => {
    // Si el usuario logueado es revendedor, filtrar solo sus propios clientes
    if (isReseller && client.resellerId !== currentUser?.id) {
      return false;
    }

    const matchesSearch =
      (client.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.serverName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.ipAddress || '').includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopyConfig = (client: VpnClient) => {
    navigator.clipboard.writeText(client.configString);
    setCopiedId(client.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenQrModal = (client: VpnClient) => {
    setSelectedClient(client);
    setActiveModal('client-qr');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <Users size={22} className="text-[var(--accent)]" />
            <span>Gestión de Clientes VPN</span>
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">
            Administra accesos SSH, V2Ray (VLESS/VMess), Trojan y WireGuard en tiempo real
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new-client')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus size={16} />
          <span>Añadir Usuario VPN</span>
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por usuario, servidor o IP..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] shrink-0">
            <Filter size={14} />
            <span className="font-semibold">Filtros:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="all">Todos los Estados</option>
            <option value="online">En Línea (Conectado)</option>
            <option value="active">Activo</option>
            <option value="expired">Expirado</option>
            <option value="suspended">Suspendido</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[var(--text-subtle)] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Conexiones</th>
                <th className="py-3.5 px-4">Tráfico Usado</th>
                <th className="py-3.5 px-4">Vencimiento</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--text-subtle)]">
                    No se encontraron clientes VPN con los criterios ingresados.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isOnline = client.status === 'online';
                  const isExpired = client.status === 'expired';
                  const isSuspended = client.status === 'suspended';

                  return (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                      {/* Username */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            {(client.username || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                              {client.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Connections */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[var(--text)]">{client.activeConnections || 0}</span>
                          <span className="text-[var(--text-subtle)]">/ {client.maxConnections || 1} dispositivos</span>
                        </div>
                      </td>

                      {/* Traffic */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-[var(--text)]">
                            {((client.downloadUsedMb || 0) / 1024).toFixed(1)} GB
                          </p>
                          <p className="text-[10px] text-[var(--text-subtle)]">
                            Límite: {client.bandwidthLimitGb || 100} GB
                          </p>
                        </div>
                      </td>

                      {/* Expiration */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Clock size={13} />
                          <span className="font-mono">{client.expirationDate}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isOnline
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isExpired
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : isSuspended
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOnline
                                ? 'bg-emerald-400 animate-ping'
                                : isExpired
                                ? 'bg-red-400'
                                : isSuspended
                                ? 'bg-amber-400'
                                : 'bg-blue-400'
                            }`}
                          />
                          {isOnline
                            ? 'Conectado'
                            : isExpired
                            ? 'Expirado'
                            : isSuspended
                            ? 'Suspendido'
                            : 'Activo'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit Client */}
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setActiveModal('edit-client');
                            }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-amber-400 hover:bg-white/10 transition-colors"
                            title="Editar Datos de Cliente"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Delete with Confirmation */}
                          <button
                            onClick={() => setClientToDelete(client)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-white/10 transition-colors"
                            title="Eliminar Cuenta"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {clientToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] border border-red-500/30 text-slate-100 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">¿Eliminar Cliente VPN?</h3>
                <p className="text-xs text-slate-400">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10 font-mono">
              Usuario: <span className="font-bold text-red-400">{clientToDelete.username}</span>
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteVpnClient(clientToDelete.id);
                  setClientToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
