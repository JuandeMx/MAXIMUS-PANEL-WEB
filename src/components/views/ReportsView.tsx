import React from 'react';
import { BarChart3, TrendingUp, Users, Server } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

export const ReportsView: React.FC = () => {
  const monthlyGrowth = [
    { month: 'Ene', users: 120, trafficTb: 8.4 },
    { month: 'Feb', users: 180, trafficTb: 12.1 },
    { month: 'Mar', users: 240, trafficTb: 18.5 },
    { month: 'Abr', users: 320, trafficTb: 24.2 },
    { month: 'May', users: 410, trafficTb: 31.0 },
    { month: 'Jun', users: 580, trafficTb: 42.8 },
    { month: 'Jul', users: 740, trafficTb: 53.0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
          <BarChart3 size={22} className="text-[var(--accent)]" />
          <span>Reportes & Estadísticas de Rendimiento</span>
        </h2>
        <p className="text-xs text-[var(--text-subtle)] mt-0.5">
          Crecimiento histórico de usuarios VPN y volumen de datos en clúster
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Bar Chart */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
            <Users size={18} className="text-cyan-400" />
            <span>Crecimiento de Cuentas VPN</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGrowth}>
                <XAxis dataKey="month" stroke="var(--text-subtle)" fontSize={11} />
                <YAxis stroke="var(--text-subtle)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="users" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Usuarios Registrados" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bandwidth Usage Chart */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            <span>Consumo de Ancho de Banda (TB)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowth}>
                <defs>
                  <linearGradient id="tbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--text-subtle)" fontSize={11} />
                <YAxis stroke="var(--text-subtle)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="trafficTb" stroke="#10b981" strokeWidth={3} fill="url(#tbGrad)" name="Tráfico Terabytes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
