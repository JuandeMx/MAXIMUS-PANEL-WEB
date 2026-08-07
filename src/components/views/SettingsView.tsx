import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Shield, Key, Sliders, Palette, Check, Save } from 'lucide-react';
import { AccentColor } from '../../types';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme, accent, setAccent, addAuditLog } = useApp();

  const [ports, setPorts] = useState({
    ssh: 22,
    openvpn: 1194,
    v2ray: 443,
    trojan: 8443,
    wireguard: 51820,
  });

  const [apiKey, setApiKey] = useState('sec_live_99812a39cba8841029312ff');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    addAuditLog('Actualizados puertos globales del sistema y parámetros de API', 'Security');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const accentOptions: { id: AccentColor; name: string; color: string }[] = [
    { id: 'cyan', name: 'Cyan Neón', color: '#22d3ee' },
    { id: 'emerald', name: 'Esmeralda', color: '#10b981' },
    { id: 'purple', name: 'Púrpura VIP', color: '#c084fc' },
    { id: 'amber', name: 'Ámbar Sol', color: '#fbbf24' },
    { id: 'rose', name: 'Rosa Neón', color: '#f43f5e' },
    { id: 'blue', name: 'Azul Pro', color: '#38bdf8' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
          <Settings size={22} className="text-[var(--accent)]" />
          <span>Configuración General del Sistema</span>
        </h2>
        <p className="text-xs text-[var(--text-subtle)] mt-0.5">
          Parámetros de puertos por protocolo, llaves API REST y preferencias visuales
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. System Ports Config */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
            <Sliders size={18} className="text-cyan-400" />
            <span>Puertos Predeterminados para Protocolos VPN</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Puerto SSH</label>
              <input
                type="number"
                value={ports.ssh}
                onChange={(e) => setPorts({ ...ports, ssh: parseInt(e.target.value) || 22 })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Puerto V2Ray TLS / WS</label>
              <input
                type="number"
                value={ports.v2ray}
                onChange={(e) => setPorts({ ...ports, v2ray: parseInt(e.target.value) || 443 })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Puerto Trojan GFW</label>
              <input
                type="number"
                value={ports.trojan}
                onChange={(e) => setPorts({ ...ports, trojan: parseInt(e.target.value) || 8443 })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Puerto WireGuard UDP</label>
              <input
                type="number"
                value={ports.wireguard}
                onChange={(e) => setPorts({ ...ports, wireguard: parseInt(e.target.value) || 51820 })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">Puerto OpenVPN TCP</label>
              <input
                type="number"
                value={ports.openvpn}
                onChange={(e) => setPorts({ ...ports, openvpn: parseInt(e.target.value) || 1194 })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* 2. API Keys & App Integration Endpoint */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
            <Key size={18} className="text-amber-400" />
            <span>Integración API para la App Móvil</span>
          </h3>

          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-200 space-y-2">
            <p className="font-bold text-cyan-300 flex items-center gap-2">
              <span>📱 URL de Sincronización para la App Móvil:</span>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/api/app/config`}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-300 font-mono text-xs font-bold"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/api/app/config`);
                  alert('¡URL de la API para la App copiada al portapapeles!');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-lg"
              >
                Copiar URL API
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Ingresa esta URL en la configuración de actualización remota de tu App Android/iOS para sincronizar Categorías, Métodos y Servidores en tiempo real.
            </p>
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] font-bold mb-1">API Token Secreta (Para Bots)</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setApiKey(`sec_live_${Math.random().toString(36).substring(2, 15)}`)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[var(--text)] shrink-0"
              >
                Regenerar Token
              </button>
            </div>
          </div>
        </div>

        {/* 3. Theme Customization */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
            <Palette size={18} className="text-purple-400" />
            <span>Tema & Apariencia</span>
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-[var(--text-muted)] mb-2">Color Neón de Acento</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {accentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccent(opt.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      accent === opt.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 font-bold'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                    <span className="text-xs text-[var(--text)]">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--text)]">Modo Oscuro Predeterminado</p>
                <p className="text-[11px] text-[var(--text-subtle)]">Alternar entre paleta oscura profunda y clara</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-[var(--text)]"
              >
                {theme === 'dark' ? 'Modo Oscuro Activo' : 'Modo Claro Activo'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-lg transition-all flex items-center gap-2"
          >
            <Save size={16} />
            <span>Guardar Configuración</span>
          </button>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check size={16} />
              <span>Cambios guardados exitosamente</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
