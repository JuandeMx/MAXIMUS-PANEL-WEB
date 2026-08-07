import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Copy, Check, Shield, Server, ArrowDown } from 'lucide-react';

export const ClientQrModal: React.FC = () => {
  const { selectedClient, setActiveModal } = useApp();
  const [copied, setCopied] = useState(false);

  if (!selectedClient) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedClient.configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-2xl glass-panel space-y-5 border border-white/10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-[var(--text)]">
            <QrCode size={20} className="text-[var(--accent)]" />
            <span>Código QR & Accesos de {selectedClient.username}</span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white space-y-2">
          <QRCodeSVG value={selectedClient.configString} size={200} level="M" />
          <p className="text-[10px] text-gray-500 font-bold tracking-wide uppercase">
            Escanea con v2rayNG, v2rayN, Shadowrocket o WireGuard App
          </p>
        </div>

        {/* Client details info */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[var(--text-subtle)] font-bold">Protocolo:</span>
            <span className="font-bold text-[var(--accent)]">{selectedClient.protocol}</span>
          </div>
          <div className="flex justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[var(--text-subtle)] font-bold">Servidor:</span>
            <span className="font-bold text-[var(--text)]">{selectedClient.serverName}</span>
          </div>
          <div className="flex justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[var(--text-subtle)] font-bold">Vencimiento:</span>
            <span className="font-mono text-amber-400 font-bold">{selectedClient.expirationDate}</span>
          </div>
        </div>

        {/* URI / String config view */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-[var(--text-subtle)] uppercase">
            Cadena de Configuración / URI:
          </label>
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-[10px] text-[var(--accent)] break-all max-h-24 overflow-y-auto">
            {selectedClient.configString}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar Configuración'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
