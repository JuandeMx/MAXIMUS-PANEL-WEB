import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  Server,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  UserPlus,
  PlusCircle,
  Terminal,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  HardDrive,
  Cpu,
  Lock,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const DashboardView: React.FC = () => {
  const { clients, servers, resellers, setActiveModal, setActiveTab, setSelectedServer } = useApp();
  const [selectedServerId, setSelectedServerId] = React.useState<string>('ALL');

  const safeClients = clients || [];
  const safeServers = servers || [];
  const safeResellers = resellers || [];

  const selectedVps = safeServers.find((s) => s.id === selectedServerId);

  const filteredClientsList = selectedServerId === 'ALL'
    ? safeClients
    : safeClients.filter((c) => c.nodeList ? c.nodeList.some((n) => n.serverId === selectedServerId) : c.serverId === selectedServerId);

  const activeClients = filteredClientsList.filter((c) => c.status === 'active' || c.status === 'online').length;
  const onlineServers = selectedServerId === 'ALL' ? safeServers.filter((s) => s.status === 'online').length : (selectedVps?.status === 'online' ? 1 : 0);
  const totalServersCount = selectedServerId === 'ALL' ? safeServers.length : 1;
  const totalTrafficGb = selectedServerId === 'ALL'
    ? safeServers.reduce((acc, s) => acc + (s.bandwidthUsedGb || 0), 0)
    : (selectedVps?.bandwidthUsedGb || 0);

  // Dynamic traffic chart based on selected VPS
  const trafficData = (servers && servers.length > 0)
    ? (selectedVps ? [
        { time: '00:00', upload: Math.round(selectedVps.cpuUsage * 8), download: Math.round(selectedVps.ramUsage * 25) },
        { time: '04:00', upload: Math.round(selectedVps.cpuUsage * 5), download: Math.round(selectedVps.ramUsage * 18) },
        { time: '08:00', upload: Math.round(selectedVps.cpuUsage * 14), download: Math.round(selectedVps.ramUsage * 42) },
        { time: '12:00', upload: Math.round(selectedVps.cpuUsage * 22), download: Math.round(selectedVps.ramUsage * 75) },
        { time: '16:00', upload: Math.round(selectedVps.cpuUsage * 30), download: Math.round(selectedVps.ramUsage * 95) },
        { time: '20:00', upload: Math.round(selectedVps.cpuUsage * 25), download: Math.round(selectedVps.ramUsage * 80) },
        { time: '24:00', upload: Math.round(selectedVps.cpuUsage * 15), download: Math.round(selectedVps.ramUsage * 50) },
      ] : [
        { time: '00:00', upload: 0, download: 0 },
        { time: '04:00', upload: 0, download: 0 },
        { time: '08:00', upload: 0, download: 0 },
        { time: '12:00', upload: 0, download: 0 },
        { time: '16:00', upload: 0, download: 0 },
        { time: '20:00', upload: 0, download: 0 },
        { time: '24:00', upload: 0, download: 0 },
      ])
    : [
        { time: '00:00', upload: 0, download: 0 },
        { time: '04:00', upload: 0, download: 0 },
        { time: '08:00', upload: 0, download: 0 },
        { time: '12:00', upload: 0, download: 0 },
        { time: '16:00', upload: 0, download: 0 },
        { time: '20:00', upload: 0, download: 0 },
        { time: '24:00', upload: 0, download: 0 },
      ];

  const protocolPieData = [
    { name: 'V2Ray (VLESS/VMess)', value: 45, color: '#22d3ee' },
    { name: 'SSH Direct/SSL', value: 25, color: '#10b981' },
    { name: 'WireGuard', value: 20, color: '#c084fc' },
    { name: 'Trojan GFW', value: 10, color: '#fbbf24' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Banner de Estado y Selección de VPS */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-[var(--accent)] flex items-center justify-center shrink-0 border border-cyan-500/40">
            <ShieldCheck size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--accent)] text-sm">Panel Privado de Uso Propio</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ILIMITADO
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Instancia privada sin límites de licencias, usuarios ni servidores VPS vinculados.
            </p>
          </div>
        </div>

        {/* Dropdown Selector de VPS */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-300 whitespace-nowrap hidden sm:inline">Filtrar VPS:</label>
          <div className="relative w-full md:w-60">
            <Server size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            <select
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#090f1e] border border-cyan-500/50 text-cyan-300 font-bold text-xs focus:border-cyan-400 focus:outline-none appearance-none cursor-pointer shadow-lg"
            >
              <option value="ALL">🌐 Todas las Máquinas VPS (Cluster)</option>
              {servers.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  🖥️ {srv.name} ({srv.ip})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid de Métricas Principales (Adaptado a la VPS seleccionada) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">Clientes VPN Activos</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[var(--text)]">{activeClients}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <TrendingUp size={12} className="mr-0.5" /> +14%
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">{filteredClientsList.length} cuentas registradas total</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">Servidores VPS</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[var(--text)]">{onlineServers}/{totalServersCount}</span>
              <span className="text-xs font-bold text-emerald-400">En línea</span>
            </div>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">{selectedVps ? selectedVps.name : 'Cluster multirregión 10 Gbps'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Server size={24} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">Tráfico Consumido</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[var(--text)]">{(totalTrafficGb / 1000).toFixed(2)} TB</span>
              <span className="text-xs font-bold text-cyan-400">Mes actual</span>
            </div>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">Límite asignado 53.0 TB</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Zap size={24} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl glass-panel glass-panel-hover transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">Revendedores</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[var(--text)]">{resellers.length}</span>
              <span className="text-xs font-bold text-amber-400">Sub-admins</span>
            </div>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">1,930 créditos circulantes</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* 3. Sección de Telemetría & Distribución de Protocolos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Telemetría Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                <Activity size={18} className="text-[var(--accent)]" />
                <span>Tráfico de Red en Tiempo Real (Mbps)</span>
              </h2>
              <p className="text-xs text-[var(--text-subtle)]">
                Ancho de banda global entrante y saliente consolidado
              </p>
            </div>
            <button
              onClick={() => setActiveTab('monitor')}
              className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>Ver Monitor Vivo</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-subtle)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-subtle)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="download" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#downloadGrad)" name="Descarga (Mbps)" />
                <Area type="monotone" dataKey="upload" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#uploadGrad)" name="Subida (Mbps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocolos y Puertos Activos Escaneados del VPS */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <span>Protocolos y Puertos Activos</span>
            </h2>
            <p className="text-xs text-[var(--text-subtle)]">
              Estado de servicios y puertos escaneados en vivo por la VPS
            </p>
          </div>

          <div className="space-y-2.5 my-auto">
            {(() => {
              if (!servers || servers.length === 0) {
                return (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-xl bg-white/5 space-y-2">
                    <p className="text-xs font-bold text-slate-400">Sin Servidores VPS Integrados</p>
                    <p className="text-[11px] text-slate-500">Agrega un servidor VPS en el módulo "Servidores VPS" para comenzar a escanear puertos y telemetría en vivo.</p>
                  </div>
                );
              }

              const targetVps = selectedVps || servers[0];
              const servicesObj = targetVps?.activeServices;

              if (servicesObj && Object.keys(servicesObj).length > 0) {
                return Object.entries(servicesObj).map(([sname, sinfo]) => {
                  const isOnline = sinfo.status === 'ONLINE';
                  return (
                    <div
                      key={sname}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
                        <span className="font-bold text-white uppercase">{sname}</span>
                      </div>

                      <div className="flex items-center gap-3 max-w-[65%] justify-end">
                        <span className="text-cyan-300 font-semibold text-right break-words truncate max-w-full">
                          Puerto: {sinfo.port || 'Auto'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                            isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {isOnline ? 'ACTIVO' : 'DETENIDO'}
                        </span>
                      </div>
                    </div>
                  );
                });
              }

              return (
                <div className="p-6 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                  <p className="text-xs text-slate-400">Escaneando servicios y puertos de {targetVps?.name}...</p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 4. Vista Rápida de Servidores Destacados */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <Server size={18} className="text-indigo-400" />
              <span>Servidores VPS en Operación</span>
            </h2>
            <p className="text-xs text-[var(--text-subtle)]">
              Estado de recursos en vivo por nodo
            </p>
          </div>
          <button
            onClick={() => setActiveTab('servers')}
            className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            <span>Ver Todos ({servers.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.slice(0, 3).map((srv) => (
            <div key={srv.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{srv.flag}</span>
                  <div>
                    <p className="text-xs font-bold text-[var(--text)]">{srv.name}</p>
                    <p className="text-[10px] text-[var(--text-subtle)] font-mono">{srv.ip}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    srv.status === 'online'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {srv.status === 'online' ? 'En Línea' : 'Mantenimiento'}
                </span>
              </div>

              {/* Resource Gauges */}
              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-[var(--text-muted)] mb-1">
                    <span className="flex items-center gap-1"><Cpu size={12} /> CPU</span>
                    <span className="font-bold">{srv.cpuUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        srv.cpuUsage > 80 ? 'bg-red-500' : srv.cpuUsage > 50 ? 'bg-amber-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${srv.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[var(--text-muted)] mb-1">
                    <span className="flex items-center gap-1"><HardDrive size={12} /> RAM</span>
                    <span className="font-bold">{srv.ramUsage}% ({((srv.ramTotalGb * srv.ramUsage) / 100).toFixed(1)} GB)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        srv.ramUsage > 80 ? 'bg-red-500' : srv.ramUsage > 50 ? 'bg-amber-500' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${srv.ramUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
                <span>Túneles: <strong className="text-[var(--text)]">{srv.activeTunnels}</strong></span>
                <button
                  onClick={() => {
                    setActiveTab('servers');
                  }}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[var(--text)] font-semibold flex items-center gap-1 text-[10px]"
                >
                  <Server size={12} />
                  <span>Ver VPS</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
