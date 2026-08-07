import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProtocolType } from '../../types';
import {
  User,
  Key,
  Calendar,
  Smartphone,
  Layers,
  Zap,
  X,
  FlaskConical,
  AlertTriangle,
} from 'lucide-react';

export const NewClientModal: React.FC = () => {
  const {
    clients,
    servers,
    addVpnClient,
    updateVpnClient,
    selectedClient,
    setSelectedClient,
    activeModal,
    setActiveModal,
    currentUser,
    resellers,
    setResellers,
  } = useApp();

  const isEditing = activeModal === 'edit-client' && !!selectedClient;

  // Account mode tab: 'usuario' | 'prueba'
  const [accountType, setAccountType] = useState<'usuario' | 'prueba'>('usuario');

  // Form states matching image
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validityDays, setValidityDays] = useState<number>(30);
  const [maxDevices, setMaxDevices] = useState<number>(1);
  const [selectedServerIds, setSelectedServerIds] = useState<string[]>([]);
  const [isV2Ray, setIsV2Ray] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Random generators
  const generateRandomUser = (prefix: string = 'demo_') => {
    return prefix + Math.random().toString(36).substring(2, 7);
  };

  const generateRandomPass = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const generateUuid = () => {
    return 'f47ac10b-58cc-4372-a567-' + Math.random().toString(36).substring(2, 10);
  };

  // Populate data on mount or edit change
  useEffect(() => {
    setErrorMsg('');
    if (isEditing && selectedClient) {
      setUsername(selectedClient.username || '');
      setPassword(selectedClient.uuidOrPassword || '');
      setMaxDevices(selectedClient.maxConnections || 1);
      setIsV2Ray(selectedClient.protocol === 'V2Ray');
      setSelectedServerIds(selectedClient.nodeList ? selectedClient.nodeList.map((n) => n.serverId) : servers.map((s) => s.id));

      // Calculate days remaining from expirationDate if available
      if (selectedClient.expirationDate) {
        const today = new Date();
        const exp = new Date(selectedClient.expirationDate);
        const diffTime = exp.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setValidityDays(diffDays > 0 ? diffDays : 30);
      } else {
        setValidityDays(30);
      }
    } else {
      // Default New Client: Normal usuario starts BLANK, all servers selected by default
      setUsername('');
      setPassword('');
      setValidityDays(30);
      setMaxDevices(1);
      setSelectedServerIds(servers.map((s) => s.id));
      setIsV2Ray(true);
      setNotes('');
      setAccountType('usuario');
    }
  }, [isEditing, selectedClient?.id]);

  // Handle Tab Switch (Usuario vs Prueba)
  const handleTabChange = (type: 'usuario' | 'prueba') => {
    setAccountType(type);
    setErrorMsg('');
    if (type === 'prueba') {
      // Automatic random username & password for test users
      setUsername(generateRandomUser('demo_'));
      setPassword(generateRandomPass());
      setValidityDays(2); // 2 days test
      setMaxDevices(1);
    } else {
      // Blank username & password for normal users
      setUsername('');
      setPassword('');
      setValidityDays(30);
      setMaxDevices(1);
    }
  };

  const handleClose = () => {
    setActiveModal(null);
    setSelectedClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().replace(/\s+/g, '_');
    if (!cleanUser) {
      setErrorMsg('Por favor ingresa un nombre de usuario.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Por favor ingresa una contraseña o UUID para el cliente.');
      return;
    }

    if (selectedServerIds.length === 0) {
      setErrorMsg('Selecciona al menos un Servidor VPS para registrar al cliente.');
      return;
    }

    // Check duplicate username
    const isDuplicate = clients.some(
      (c) => c.username.toLowerCase() === cleanUser && c.id !== selectedClient?.id
    );

    if (isDuplicate) {
      setErrorMsg(`El usuario "${cleanUser}" ya existe. Por favor elige un nombre diferente.`);
      return;
    }

    const protocol: ProtocolType = isV2Ray ? 'V2Ray' : 'SSH';

    // Expiration date
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + (Number(validityDays) || 30));
    const expirationDateStr = expDate.toISOString().split('T')[0];

    const chosenServers = servers.filter((s) => selectedServerIds.includes(s.id));
    const targetServer = chosenServers[0] || servers[0] || {
      id: 'srv-1',
      name: 'Servidor Principal',
      ip: '190.201.100.5',
    };

    const nodeList = chosenServers.map((s) => ({ serverId: s.id, serverName: s.name, ip: s.ip }));

    const secretKey = password.trim() || (isV2Ray ? generateUuid() : generateRandomPass());

    const configStr = isV2Ray
      ? `vless://${secretKey}@${targetServer.ip}:443?type=ws&security=tls#${targetServer.name}-${cleanUser}`
      : `ssh ${cleanUser}@${targetServer.ip} -p 22`;

    // Reseller credit check & deduction
    const isReseller = currentUser?.role === 'reseller';
    if (isReseller && !isEditing && currentUser) {
      const resellerObj = resellers.find((r) => r.id === currentUser.id);
      if (accountType === 'prueba') {
        if (!resellerObj || (resellerObj.demoCredits || 0) < 1) {
          setErrorMsg('No tienes suficientes créditos DEMO. Solicita una recarga al administrador.');
          return;
        }
        // Deduct 1 demo credit properly
        setResellers((prev) =>
          prev.map((r) =>
            r.id === currentUser.id
              ? { ...r, demoCredits: (r.demoCredits || 0) - 1, activeClientsCount: (r.activeClientsCount || 0) + 1 }
              : r
          )
        );
      } else {
        if (!resellerObj || (resellerObj.credits || 0) < 1) {
          setErrorMsg('No tienes suficientes créditos de VENTA. Solicita una recarga al administrador.');
          return;
        }
        // Deduct 1 sale credit properly
        setResellers((prev) =>
          prev.map((r) =>
            r.id === currentUser.id
              ? { ...r, credits: (r.credits || 0) - 1, activeClientsCount: (r.activeClientsCount || 0) + 1 }
              : r
          )
        );
      }
    }

    if (isEditing && selectedClient) {
      updateVpnClient(selectedClient.id, {
        username: cleanUser,
        protocol,
        maxConnections: Number(maxDevices) || 1,
        expirationDate: expirationDateStr,
        uuidOrPassword: secretKey,
        configString: configStr,
        nodeList,
        validityDays: Number(validityDays) || 1,
      } as any);
    } else {
      addVpnClient({
        username: cleanUser,
        protocol,
        serverId: targetServer.id,
        serverName: targetServer.name,
        ipAddress: targetServer.ip,
        maxConnections: Number(maxDevices) || 1,
        bandwidthLimitGb: 100,
        expirationDate: expirationDateStr,
        status: 'active',
        uuidOrPassword: secretKey,
        configString: configStr,
        nodeList,
        resellerId: currentUser?.id,
        validityDays: Number(validityDays) || 1,
      } as any);
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-6 rounded-2xl bg-[#0f172a] border border-cyan-500/20 text-slate-100 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {isEditing ? 'Editar Cliente VPN' : 'Crear Nuevo Cliente VPN'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-center gap-2.5 font-semibold text-xs animate-in fade-in">
              <AlertTriangle size={18} className="shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Top Mode Tabs (Ocultos si está editando) */}
          {!isEditing && (
            <div className="p-1 rounded-xl bg-[#0a1120] border border-slate-800 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => handleTabChange('usuario')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  accountType === 'usuario'
                    ? 'bg-[#06b6d4] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <User size={16} />
                <span>Usuario</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('prueba')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  accountType === 'prueba'
                    ? 'bg-[#06b6d4] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FlaskConical size={16} />
                <span>Prueba</span>
              </button>
            </div>
          )}

          {/* Row 1: Usuario VPN & Contraseña VPN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-semibold text-[11px]">
                Usuario VPN
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090f1e] border border-slate-700/60 text-white font-mono text-xs focus:border-[#06b6d4] focus:outline-none transition-colors"
                  placeholder="Ingresa usuario..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-400 font-semibold text-[11px]">
                Contraseña VPN
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090f1e] border border-slate-700/60 text-white font-mono text-xs focus:border-[#06b6d4] focus:outline-none transition-colors"
                  placeholder="Ingresa contraseña..."
                />
              </div>
            </div>
          </div>

          {/* Row 2: Días de Validez */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold text-[11px]">
              Días de Validez
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min={1}
                required
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value) || 1)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#090f1e] border border-slate-700/60 text-white font-mono text-xs focus:border-[#06b6d4] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Notas (Opcional) */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold text-[11px]">
              Notas (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Cliente nuevo de WhatsApp"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090f1e] border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:border-[#06b6d4] focus:outline-none transition-colors"
            />
          </div>

          {/* Cuadro de texto para copiar credenciales rápidas */}
          {username.trim() && (
            <div className="p-3 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-300">Formato para Copiar al Cliente:</span>
                <button
                  type="button"
                  onClick={() => {
                    const expDate = new Date();
                    expDate.setDate(expDate.getDate() + (Number(validityDays) || 30));
                    const text = `Vencimiento: ${expDate.toISOString().split('T')[0]}\nUsuario: ${username.trim()}\nContraseña: ${password.trim()}`;
                    navigator.clipboard.writeText(text);
                    alert('¡Credenciales copiadas al portapapeles!');
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06b6d4] text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  Copiar Texto
                </button>
              </div>
              <p className="text-xs font-mono text-slate-200 select-all whitespace-pre-line bg-[#090f1e] p-2.5 rounded-lg border border-slate-800">
                {`Vencimiento: ${(() => {
                  const expDate = new Date();
                  expDate.setDate(expDate.getDate() + (Number(validityDays) || 30));
                  return expDate.toISOString().split('T')[0];
                })()}\nUsuario: ${username.trim()}\nContraseña: ${password.trim()}`}
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1e293b] text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#06b6d4] hover:bg-[#0891b2] text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Cliente VPN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
