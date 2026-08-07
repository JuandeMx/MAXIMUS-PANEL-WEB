import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  X,
  Copy,
  Check,
  Terminal,
  Code2,
  CheckCircle2,
  Sparkles,
  Info,
  Server,
  Layers,
  Globe,
} from 'lucide-react';

export const NewMethodModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    addConnectionMethod,
    updateConnectionMethod,
    selectedMethod,
    setSelectedMethod,
    categories,
  } = useApp();

  const isEditing = activeModal === 'edit-method' && !!selectedMethod;

  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sshHost, setSshHost] = useState('');
  const [sshPort, setSshPort] = useState(80);
  const [protocol, setProtocol] = useState('HTTP DIRECT / PAYLOAD');
  const [sni, setSni] = useState('');
  const [payload, setPayload] = useState('');

  useEffect(() => {
    if (isEditing && selectedMethod) {
      setCategoryId(selectedMethod.categoryId || (categories[0]?.id || ''));
      setName(selectedMethod.name || '');
      setDescription(selectedMethod.description || '');
      setSshHost(selectedMethod.sshHost || '');
      setSshPort(selectedMethod.sshPort || 80);
      setProtocol(selectedMethod.protocol || 'HTTP DIRECT / PAYLOAD');
      setSni(selectedMethod.sni || '');
      setPayload(selectedMethod.payload || '');
    } else {
      setCategoryId(categories[0]?.id || '');
      setName('');
      setDescription('');
      setSshHost('');
      setSshPort(80);
      setProtocol('HTTP DIRECT / PAYLOAD');
      setSni('');
      setPayload('');
    }
  }, [isEditing, selectedMethod, categories]);

  const handleClose = () => {
    setActiveModal(null);
    setSelectedMethod(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && selectedMethod) {
      updateConnectionMethod(selectedMethod.id, {
        categoryId: categoryId || (categories[0]?.id || ''),
        name: name.trim(),
        description: description.trim(),
        sshHost: sshHost.trim(),
        sshPort: Number(sshPort) || 80,
        protocol: protocol.trim(),
        sni: sni.trim(),
        payload: payload.trim(),
      });
    } else {
      addConnectionMethod({
        categoryId: categoryId || (categories[0]?.id || ''),
        name: name.trim(),
        description: description.trim(),
        sshHost: sshHost.trim(),
        sshPort: Number(sshPort) || 80,
        protocol: protocol.trim(),
        sni: sni.trim(),
        payload: payload.trim(),
      });
    }

    handleClose();
  };

  const insertPayloadTag = (tag: string) => {
    setPayload((prev) => prev + tag);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 rounded-2xl glass-panel space-y-4 border border-white/10 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-[var(--text)]">
            <Zap size={20} className="text-[var(--accent)]" />
            <span>
              {isEditing
                ? `Editar Método: ${selectedMethod?.name}`
                : 'Agregar Nuevo Método de Conexión'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--text)] text-[11px] leading-relaxed flex items-start gap-2.5">
            <Sparkles size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[var(--accent)]">
                Configuración para la App Móvil:
              </span>{' '}
              Puedes usar las etiquetas dinámicas <code className="text-cyan-300 font-mono">[CF]</code> (Dominio Cloudflare),{' '}
              <code className="text-amber-300 font-mono">[CFT]</code> (CloudFront), <code className="text-emerald-300 font-mono">[IP]</code> y{' '}
              <code className="text-purple-300 font-mono">[crlf]</code> / <code className="text-purple-300 font-mono">[lf]</code> que la App traducirá automáticamente en cada servidor.
            </div>
          </div>

          {/* Categoría y Nombre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">
                Categoría <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-semibold focus:border-[var(--accent)] focus:outline-none"
              >
                {categories.length === 0 ? (
                  <option value="">No hay categorías creadas aún</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">
                Nombre del Método <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ej. METHOD CF 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-semibold focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          {/* Descripción Corta y Protocolo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">
                Descripción Corta (Ej: Front Prepago Abono)
              </label>
              <input
                type="text"
                placeholder="ej. Front Prepago Abono"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-semibold focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">
                Modo / Protocolo de Túnel
              </label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="HTTP DIRECT / PAYLOAD">HTTP DIRECT / PAYLOAD</option>
                <option value="SSL + Payload (WebSocket)">SSL + Payload (WebSocket)</option>
                <option value="SSL DIRECT">SSL DIRECT</option>
                <option value="PROXY + PAYLOAD">PROXY + PAYLOAD</option>
                <option value="SLOWDNS">SLOWDNS</option>
                <option value="V2RAY / VMESS">V2RAY / VMESS</option>
                <option value="TROJAN GFW">TROJAN GFW</option>
              </select>
            </div>
          </div>

          {/* SSH Host, Puerto y SNI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">
                SSH Host / Proxy Domain
              </label>
              <input
                type="text"
                placeholder="ej. Sat24.com o [IP]"
                value={sshHost}
                onChange={(e) => setSshHost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-mono focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">
                Puerto (WebSocket / Proxy)
              </label>
              <input
                type="number"
                value={sshPort}
                onChange={(e) => setSshPort(parseInt(e.target.value) || 80)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-mono focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-bold mb-1">
                Host SNI (Opcional)
              </label>
              <input
                type="text"
                placeholder="ej. [CF], [CFT] o www.fahorro.com"
                value={sni}
                onChange={(e) => setSni(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-mono focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          {/* Payload String con Helper Tags */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[var(--text-muted)] font-bold">
                Payload String (Cuerpo de la Petición HTTP)
              </label>
              <span className="text-[10px] text-[var(--text-subtle)] font-mono">
                [crlf] = \r\n | [lf] = \n
              </span>
            </div>

            {/* Quick tag insert buttons */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {['[CF]', '[CFT]', '[IP]', '[crlf]', '[lf]', '[split]', '[instant_split]', '[host]', '[ua]'].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertPayloadTag(tag)}
                    className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-[var(--accent)]/30 text-cyan-300 font-mono text-[10px] border border-white/10 transition-all"
                  >
                    +{tag}
                  </button>
                )
              )}
            </div>

            <textarea
              rows={4}
              placeholder="GET / HTTP/1.1[crlf]Host: [CF][crlf]Connection: Upgrade[crlf]Upgrade: websocket[crlf][crlf]"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-emerald-400 font-mono text-[11px] leading-relaxed focus:border-[var(--accent)] focus:outline-none select-all resize-y"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl font-bold text-[var(--text-muted)] hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-lg flex items-center gap-2 transition-all"
            >
              <CheckCircle2 size={16} />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Método de Conexión'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
