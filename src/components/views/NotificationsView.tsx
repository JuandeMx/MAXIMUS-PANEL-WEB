import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <Bell size={22} className="text-[var(--accent)]" />
            <span>Centro de Notificaciones & Alertas</span>
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">
            Alertas críticas de servidores, seguridad y renovación de licencias
          </p>
        </div>

        <button
          onClick={clearNotifications}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-[var(--text-muted)] border border-white/10 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 size={14} />
          <span>Limpiar Notificaciones</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl text-[var(--text-subtle)]">
            No tienes notificaciones pendientes. Todo funciona con normalidad.
          </div>
        ) : (
          notifications.map((n) => {
            const isWarning = n.type === 'warning';
            const isDanger = n.type === 'danger';
            const isSuccess = n.type === 'success';

            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-2xl glass-panel transition-all flex items-start gap-4 cursor-pointer ${
                  !n.read ? 'border-l-4 border-l-[var(--accent)] bg-white/5' : 'opacity-75'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isWarning
                      ? 'bg-amber-500/20 text-amber-400'
                      : isDanger
                      ? 'bg-red-500/20 text-red-400'
                      : isSuccess
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {isWarning ? (
                    <AlertTriangle size={20} />
                  ) : isDanger ? (
                    <XCircle size={20} />
                  ) : isSuccess ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[var(--text)]">{n.title}</h3>
                    <span className="text-[10px] text-[var(--text-subtle)] font-medium">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{n.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
