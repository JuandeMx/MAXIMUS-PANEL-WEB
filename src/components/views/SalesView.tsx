import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Download, DollarSign, CheckCircle2, XCircle } from 'lucide-react';

export const SalesView: React.FC = () => {
  const { transactions } = useApp();

  const totalRevenue = transactions
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
            <CreditCard size={22} className="text-emerald-400" />
            <span>Registro de Ventas & Facturación</span>
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mt-0.5">
            Historial de transacciones de licencias, recargas de revendedores y suscripciones
          </p>
        </div>

        <button
          onClick={() => alert('Exportando reporte de transacciones CSV...')}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-[var(--text)] border border-white/10 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Exportar CSV</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl glass-panel flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl border border-emerald-500/30">
          <DollarSign size={32} />
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--text-subtle)] uppercase">Ingresos Totales Consolidados</p>
          <p className="text-3xl font-black text-[var(--text)]">${totalRevenue.toLocaleString()} USD</p>
        </div>
      </div>

      <div className="rounded-2xl glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[var(--text-subtle)] font-bold uppercase">
                <th className="py-3.5 px-4">ID Transacción</th>
                <th className="py-3.5 px-4">Cliente / Revendedor</th>
                <th className="py-3.5 px-4">Concepto</th>
                <th className="py-3.5 px-4">Monto</th>
                <th className="py-3.5 px-4">Pasarela</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--accent)]">{trx.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[var(--text)]">{trx.clientName}</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">{trx.planName}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">${trx.amount} USD</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/10 font-medium text-[10px]">
                      {trx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-subtle)] font-mono">{trx.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        trx.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {trx.status === 'completed' ? (
                        <>
                          <CheckCircle2 size={12} /> Completado
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Fallido
                        </>
                      )}
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
