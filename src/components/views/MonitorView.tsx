import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Zap,
  ArrowDownCircle,
  ArrowUpCircle,
  Radio,
  Wifi,
  Server,
  Globe,
  Gauge,
  Cpu,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const MonitorView: React.FC = () => {
  const { clients, servers } = useApp();

  const [liveMetrics, setLiveMetrics] = useState([
    { time: '20:40:00', download: 1840, upload: 320 },
    { time: '20:40:05', download: 2100, upload: 410 },
    { time: '20:40:10', download: 1950, upload: 380 },
    { time: '20:40:15', download: 2450, upload: 520 },
    { time: '20:40:20', download: 2890, upload: 610 },
    { time: '20:40:25', download: 2600, upload: 580 },
  ]);

  const [currentDownload, setCurrentDownload] = useState(2600);
  const [currentUpload, setCurrentUpload] = useState(580);

  // Live WebSocket Tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toTimeString().split(' ')[0];
      const newDl = Math.floor(2000 + Math.random() * 1500);
      const newUl = Math.floor(400 + Math.random() * 400);

      setCurrentDownload(newDl);
      setCurrentUpload(newUl);

      setLiveMetrics((prev) => {
        const next = [...prev.slice(1), { time: now, download: newDl, upload: newUl }];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Active Connection Streams
  const activeStreams = [
    { id: 'st-01', user: 'carlos_streamer', ip: '190.201.44.12', server: 'US-East Miami Pro', protocol: 'V2Ray', ping: '28 ms', speed: '42.5 Mbps' },
    { id: 'st-02', user: 'maria_gomez', ip: '88.12.90.31', server: 'EU-Central Frankfurt 01', protocol: 'SSH', ping: '112 ms', speed: '12.1 Mbps' },
    { id: 'st-03', user: 'gamer_alberto', ip: '200.89.12.50', server: 'US-East Miami Pro', protocol: 'WireGuard', ping: '18 ms', speed: '88.4 Mbps' },
    { id: 'st-04', user: 'roberto_dev', ip: '177.33.19.82', server: 'SA-East São Paulo', protocol: 'V2Ray', ping: '34 ms', speed: '24.8 Mbps' },
    { id: 'st-05', user: 'juan_master', ip: '181.200.12.5', server: 'AP-East Tokyo Express', protocol: 'Trojan', ping: '145 ms', speed: '18.2 Mbps' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <Activity size={22} className="text-emerald-400" />
            <span>Telemetría de Red y Monitor en Vivo</span>
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">
            Streaming de paquetes en tiempo real, latencia de túneles y ancho de banda global
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SOCKETS WEBSOCKET CONECTADOS</span>
        </div>
      </div>

      {/* Speedometer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Download Speed */}
        <div className="p-6 rounded-2xl glass-panel flex items-center justify-between border-l-4 border-l-[var(--accent)]">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[var(--text-subtle)] uppercase flex items-center gap-1.5">
              <ArrowDownCircle size={16} className="text-[var(--accent)]" />
              Ancho de Banda Entrante (Descarga)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--text)]">{(currentDownload / 1000).toFixed(2)}</span>
              <span className="text-sm font-bold text-[var(--accent)]">Gbps</span>
            </div>
            <p className="text-[11px] text-[var(--text-subtle)]">{currentDownload} Mbps promedio directo</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
            <Gauge size={32} className="animate-pulse" />
          </div>
        </div>

        {/* Upload Speed */}
        <div className="p-6 rounded-2xl glass-panel flex items-center justify-between border-l-4 border-l-emerald-400">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[var(--text-subtle)] uppercase flex items-center gap-1.5">
              <ArrowUpCircle size={16} className="text-emerald-400" />
              Ancho de Banda Saliente (Subida)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--text)]">{(currentUpload / 1000).toFixed(2)}</span>
              <span className="text-sm font-bold text-emerald-400">Gbps</span>
            </div>
            <p className="text-[11px] text-[var(--text-subtle)]">{currentUpload} Mbps retorno estable</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wifi size={32} />
          </div>
        </div>
      </div>

      {/* Real-time Line Chart */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
          <Radio size={18} className="text-cyan-400 animate-pulse" />
          <span>Frecuencia de Tráfico Cada 2 Segundos</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveMetrics}>
              <defs>
                <linearGradient id="liveDl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="liveUl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="var(--text-subtle)" fontSize={11} />
              <YAxis stroke="var(--text-subtle)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="download" stroke="var(--accent)" strokeWidth={3} fill="url(#liveDl)" name="Descarga (Mbps)" />
              <Area type="monotone" dataKey="upload" stroke="#10b981" strokeWidth={3} fill="url(#liveUl)" name="Subida (Mbps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Socket Streams Table */}
      <div className="rounded-2xl glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-bold text-[var(--text)]">Túneles VPN Transmitiendo Datos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[var(--text-subtle)] font-bold uppercase">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">IP Cliente</th>
                <th className="py-3 px-4">Nodo Servidor</th>
                <th className="py-3 px-4">Protocolo</th>
                <th className="py-3 px-4">Latencia Ping</th>
                <th className="py-3 px-4 text-right">Velocidad Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeStreams.map((st) => (
                <tr key={st.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-[var(--text)]">{st.user}</td>
                  <td className="py-3 px-4 font-mono text-[var(--text-subtle)]">{st.ip}</td>
                  <td className="py-3 px-4 text-[var(--text-muted)] font-medium">{st.server}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/10 font-bold text-[10px]">
                      {st.protocol}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{st.ping}</td>
                  <td className="py-3 px-4 text-right font-bold text-[var(--accent)]">{st.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
