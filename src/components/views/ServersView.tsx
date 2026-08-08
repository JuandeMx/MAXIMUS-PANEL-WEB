import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VpsServer } from '../../types';
import {
  Server,
  Plus,
  RefreshCw,
  Trash2,
  Cpu,
  HardDrive,
  Activity,
  Zap,
  Globe,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Check,
  Users,
} from 'lucide-react';

export const ServersView: React.FC = () => {
  const {
    servers,
    setActiveModal,
    setSelectedServer,
    restartVpsServer,
    deleteVpsServer,
    updateVpsServer,
    syncAllUsersToNewVps,
  } = useApp();

  const [rebootingId, setRebootingId] = useState<string | null>(null);
  const [syncingServerId, setSyncingServerId] = useState<string | null>(null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [editingDomainServerId, setEditingDomainServerId] = useState<string | null>(null);

  const handleReboot = async (server: VpsServer) => {
    setRebootingId(server.id);
    await restartVpsServer(server.id);
    setRebootingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <Server size={22} className="text-indigo-400" />
            <span>Gestión de Servidores VPS</span>
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">
            Estado de salud, recursos de CPU/RAM, puertos SSH y túneles VPN activos por máquina
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new-server')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Integrar Nuevo VPS</span>
        </button>
      </div>

      {/* Grid of Servers */}
      {servers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel space-y-3">
          <Server size={40} className="mx-auto text-[var(--text-subtle)] opacity-40" />
          <h3 className="text-base font-bold text-[var(--text)]">No hay servidores VPS integrados</h3>
          <p className="text-xs text-[var(--text-subtle)] max-w-md mx-auto">
            Comienza vinculando tu primera máquina virtual VPS para instalar los protocolos VPN y desplegar túneles.
          </p>
          <button
            onClick={() => setActiveModal('new-server')}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Integrar Nuevo VPS</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => {
          const isOnline = server.status === 'online';
          const isRebooting = rebootingId === server.id;

          return (
            <div
              key={server.id}
              className={`p-6 rounded-2xl glass-panel transition-all flex flex-col justify-between space-y-6 ${
                isOnline ? 'hover:border-white/20' : 'border-amber-500/30'
              }`}
            >
              <div>
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{server.flag}</span>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text)]">{server.name}</h3>
                      <p className="text-xs font-mono text-[var(--text-subtle)] flex items-center gap-1 mt-0.5">
                        <Globe size={12} />
                        <span>{server.ip}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                      isOnline
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                      }`}
                    />
                    {isOnline ? 'En Línea' : 'Mantenimiento'}
                  </span>
                </div>

                {/* Sub Metadata */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-[var(--text-muted)] bg-white/5 p-3 rounded-xl">
                  <div>
                    <span className="text-[var(--text-subtle)] block">Sistema Operativo:</span>
                    <span className="font-semibold text-[var(--text)]">{server.os}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-subtle)] block">Tiempo en Línea:</span>
                    <span className="font-semibold text-[var(--text)] flex items-center gap-1">
                      <Clock size={11} /> {server.uptime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-subtle)] block">Puerto SSH:</span>
                    <span className="font-semibold font-mono text-[var(--accent)]">{server.sshPort}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-subtle)] block">Túneles VPN:</span>
                    <span className="font-bold text-emerald-400">{server.activeTunnels} activos</span>
                  </div>
                </div>

                {/* Dominios Cloudflare (CF / CFT) */}
                <div className="mt-3 bg-[#090f1e]/80 border border-slate-700/50 p-3 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5 text-[11px]">
                      <Globe size={13} /> Dominios Cloudflare (CF / CFT)
                    </span>
                    {editingDomainServerId === server.id && (
                      <span className="text-[10px] text-emerald-400 font-semibold animate-pulse">Guardado</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Dominio CF (SNI):</label>
                      <input
                        type="text"
                        placeholder="cf.midominio.com"
                        value={server.domainCf || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateVpsServer(server.id, { domainCf: val });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-cyan-300 font-mono text-[11px] focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Dominio CFT (TLS/WS):</label>
                      <input
                        type="text"
                        placeholder="cft.midominio.com"
                        value={server.domainCft || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateVpsServer(server.id, { domainCft: val });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-purple-300 font-mono text-[11px] focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Hardware Resource Progress Bars */}
                <div className="mt-5 space-y-3">
                  {/* CPU Gauge */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)] flex items-center gap-1 font-semibold">
                        <Cpu size={14} className="text-cyan-400" />
                        Consumo CPU
                      </span>
                      <span className="font-bold text-[var(--text)]">{server.cpuUsage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          server.cpuUsage > 80 ? 'bg-red-500' : server.cpuUsage > 50 ? 'bg-amber-500' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${server.cpuUsage}%` }}
                      />
                    </div>
                  </div>

                  {/* RAM Gauge */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)] flex items-center gap-1 font-semibold">
                        <HardDrive size={14} className="text-indigo-400" />
                        Memoria RAM
                      </span>
                      <span className="font-bold text-[var(--text)]">
                        {server.ramUsage}% ({((server.ramTotalGb * server.ramUsage) / 100).toFixed(1)} / {server.ramTotalGb} GB)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          server.ramUsage > 80 ? 'bg-red-500' : server.ramUsage > 50 ? 'bg-amber-500' : 'bg-indigo-400'
                        }`}
                        style={{ width: `${server.ramUsage}%` }}
                      />
                    </div>
                  </div>

                  {/* Disk Gauge */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)] flex items-center gap-1 font-semibold">
                        <Activity size={14} className="text-purple-400" />
                        Disco SSD
                      </span>
                      <span className="font-bold text-[var(--text)]">
                        {server.diskUsage}% ({((server.diskTotalGb * server.diskUsage) / 100).toFixed(0)} / {server.diskTotalGb} GB)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          server.diskUsage > 80 ? 'bg-red-500' : server.diskUsage > 50 ? 'bg-amber-500' : 'bg-purple-400'
                        }`}
                        style={{ width: `${server.diskUsage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Installed Protocols Pills */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {server.installedProtocols.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[var(--text-muted)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10">
                {/* Sync Users to this VPS */}
                <button
                  onClick={async () => {
                    setSyncingServerId(server.id);
                    await syncAllUsersToNewVps(server);
                    setTimeout(() => setSyncingServerId(null), 2000);
                  }}
                  disabled={syncingServerId === server.id}
                  className="py-2 px-1 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-1 border border-cyan-500/30 disabled:opacity-50"
                  title="Registrar / Sincronizar todos los usuarios existentes en esta máquina"
                >
                  <Users size={14} className={syncingServerId === server.id ? 'animate-spin' : ''} />
                  <span>{syncingServerId === server.id ? 'Sincronizando...' : 'Sincronizar'}</span>
                </button>

                {/* Reboot */}
                <button
                  onClick={() => handleReboot(server)}
                  disabled={isRebooting}
                  className="py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                  title="Reiniciar Máquina VPS"
                >
                  <RefreshCw size={14} className={isRebooting ? 'animate-spin' : ''} />
                  <span>{isRebooting ? '...' : 'Reiniciar'}</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteVpsServer(server.id)}
                  className="py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                  title="Remover de Cluster"
                >
                  <Trash2 size={14} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
