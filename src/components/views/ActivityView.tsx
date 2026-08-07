import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, Shield, CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { auditLogs, searchQuery, setSearchQuery } = useApp();

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <History size={22} className="text-purple-400" />
            <span>Registro de Actividad & Auditoría</span>
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">
            Logs de seguridad, acciones administrativas e interacciones con la API
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en logs..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div className="rounded-2xl glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[var(--text-subtle)] font-bold uppercase">
                <th className="py-3.5 px-4">Fecha & Hora</th>
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">IP Origen</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Detalle de la Acción</th>
                <th className="py-3.5 px-4">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors text-[11px]">
                  <td className="py-3 px-4 text-[var(--text-subtle)]">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-[var(--text)]">{log.user}</td>
                  <td className="py-3 px-4 text-[var(--accent)]">{log.ip}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/10 font-bold text-[10px]">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-[var(--text-muted)] font-medium">{log.action}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : log.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {log.status === 'success' ? (
                        <CheckCircle size={11} />
                      ) : log.status === 'warning' ? (
                        <AlertTriangle size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
