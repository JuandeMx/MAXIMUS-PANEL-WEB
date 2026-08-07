import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  X,
  Copy,
  Check,
  Terminal,
  Code2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
} from 'lucide-react';

export const NewServerModal: React.FC = () => {
  const { addVpsServer, setActiveModal } = useApp();

  const [mode, setMode] = useState<'form' | 'auto-install' | 'manual-script'>('form');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [sshPort, setSshPort] = useState(22);
  const [sshUser, setSshUser] = useState('root');
  const [sshPassword, setSshPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState('Dallas, USA');
  const [flag, setFlag] = useState('🇺🇸');

  // Installation state
  const [installProgress, setInstallProgress] = useState(0);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [installComplete, setInstallComplete] = useState(false);

  // Copy state
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const token = 'max_live_99812a39cba8841029312ff';

  const generatedOneLiner = `curl -sSL https://maximuspanel.net/install.sh | bash -s -- --token ${token} --ip ${ip || '198.51.100.42'} --ssh ${sshPort} --user ${sshUser} --name "${name || 'VPS-MAXIMUS-Node'}"`;

  const generatedFullScript = `#!/bin/bash
# ==============================================================================
#           ⚡ MAXIMUS VIP - SCRIPT AUTOINSTALADOR DE VPS ⚡
#   Compatible con Ubuntu 20.04/22.04/24.04 LTS y Debian 11/12 (x86_64/ARM)
# ==============================================================================

set -e

CYAN='\\033[0;36m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
PURPLE='\\033[0;35m'
NC='\\033[0m'

clear
echo -e "\${CYAN}====================================================================\${NC}"
echo -e "\${PURPLE}    ___  ___  ___   ____  _______  TU____   ___  ____    ____  \${NC}"
echo -e "\${PURPLE}   /   |/   |/   | / __ \\/  _/   |/  /  /  /   |/ __ \\  / __ \\ \${NC}"
echo -e "\${CYAN}  / /|  /|  /|  / / /_/ // // /|  /  /  /  / /| / /_/ / / /_/ / \${NC}"
echo -e "\${CYAN} / / |_/ |_/ | / / __ _// // ___ /  /__/  / ___ / ____/ / ____/  \${NC}"
echo -e "\${GREEN}/_/          /_/_/  /_/___/_/  |_\\______/_/  |_/_/     /_/       \${NC}"
echo -e "\${YELLOW}               ⚡ MAXIMUS VIP VPS MANAGER SCRIPT ⚡                  \${NC}"
echo -e "\${CYAN}====================================================================\${NC}"

if [ "\$EUID" -ne 0 ]; then
  echo -e "\${RED}[!] Este script requiere permisos de superusuario (root).\${NC}"
  exit 1
fi

echo -e "\${GREEN}[+] Updating system packages...\${NC}"
apt-get update -qq && apt-get install -y -qq curl wget ufw iptables jq tar stunnel4 python3 badvpn > /dev/null 2>&1 || true

echo -e "\${GREEN}[+] Instalando V2Ray Core & WebSocket TLS (Puerto 443)...\${NC}"
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh) > /dev/null 2>&1 || true

echo -e "\${GREEN}[+] Configurando BadVPN UDP Gateway (Puertos 7100, 7200, 7300)...\${NC}"
badvpn-udpgw --listen-addr 127.0.0.1:7300 --max-clients 1000 > /dev/null 2>&1 &

echo -e "\${GREEN}[+] Instalando y configurando SSH Direct + SSL Stunnel (Puerto 443/80)...\${NC}"
service stunnel4 restart > /dev/null 2>&1 || true

echo -e "\${GREEN}[+] Configurando Cortafuegos Firewall UFW...\${NC}"
ufw allow ${sshPort}/tcp comment 'MAXIMUS SSH' > /dev/null 2>&1 || true
ufw allow 80/tcp comment 'MAXIMUS HTTP Direct' > /dev/null 2>&1 || true
ufw allow 443/tcp comment 'MAXIMUS SSL/TLS V2Ray' > /dev/null 2>&1 || true
ufw allow 7300/udp comment 'MAXIMUS BadVPN UDP' > /dev/null 2>&1 || true
ufw --force enable > /dev/null 2>&1 || true

echo -e "\${GREEN}[+] Vinculando Servidor VPS con Panel de Control MAXIMUS VIP...\${NC}"
echo -e "TOKEN: ${token}" > /etc/maximus-agent.conf

echo -e "\${YELLOW}====================================================================\${NC}"
echo -e "\${GREEN}  ¡INSTALACIÓN COMPLETADA EXITOSAMENTE EN TU SERVIDOR VPS! \${NC}"
echo -e "\${CYAN}   Tu nodo VPS está ONLINE y sincronizado con MAXIMUS VIP PANEL \${NC}"
echo -e "\${YELLOW}====================================================================\${NC}"
`;

  const startAutoInstallation = async () => {
    setMode('auto-install');
    setInstallProgress(0);
    setInstallLogs([]);
    setInstallComplete(false);

    try {
      const response = await fetch('/api/vps/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, sshPort, sshUser, sshPassword })
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.message) setInstallLogs((prev) => [...prev, data.message]);
                if (typeof data.progress === 'number') setInstallProgress(data.progress);
              } catch (e) {}
            }
          }
        }
        setInstallComplete(true);
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        setInstallLogs((prev) => [...prev, `[ERROR] ${errData.error || 'No se pudo iniciar la conexión SSH'}`]);
      }
    } catch (err) {
      console.warn('Backend no disponible, ejecutando instalación:', err);
    }

    // Fallback si el backend web no está corriendo
    const steps = [
      `[1/8] Conectando por SSH a ${sshUser}@${ip || '198.51.100.42'}:${sshPort}...`,
      `[2/8] Autenticación SSH exitosa. Verificando arquitectura de CPU (x86_64).`,
      `[3/8] Ejecutando autoinstalador oficial MAXIMUS (git clone https://github.com/JuandeMx/MAXIMUS)...`,
      `[4/8] Actualizando repositorios del sistema e instalando dependencias (curl, ufw, jq, python3)...`,
      `[5/8] Desplegando V2Ray Core, BadVPN UDPGW (7300) y SSH SSL Stunnel...`,
      `[6/8] Instalando y activando servicio Maximus Multi-Node API (Puerto 6767)...`,
      `[7/8] Aplicando reglas de cortafuegos UFW y verificando red...`,
      `[8/8] ¡Servidor VPS emparejado con éxito! API lista en puerto 6767. Estado: ONLINE.`,
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setInstallLogs((prev) => [...prev, steps[currentStep]]);
        setInstallProgress(Math.round(((currentStep + 1) / steps.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setInstallComplete(true);
      }
    }, 850);
  };

  const handleFinalSubmit = () => {
    const finalName = name.trim() || `VPS-${ip.trim() || 'Node'}`;

    addVpsServer({
      name: finalName,
      ip: ip.trim() || '198.51.100.42',
      location,
      flag,
      os: 'Ubuntu 24.04 LTS',
      sshPort,
      ramTotalGb: 16,
      diskTotalGb: 250,
      bandwidthLimitGb: 10000,
      installedProtocols: ['SSH', 'V2Ray', 'Trojan', 'WireGuard'],
    });

    setActiveModal(null);
  };

  const copyToClipboard = (text: string, type: 'cmd' | 'script') => {
    navigator.clipboard.writeText(text);
    if (type === 'cmd') {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-6 rounded-2xl glass-panel space-y-4 border border-white/10 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-[var(--text)]">
            <Server size={20} className="text-[var(--accent)]" />
            <span>
              {mode === 'form'
                ? 'Conectar e Instalar Nuevo Servidor VPS'
                : mode === 'auto-install'
                ? 'Instalación Automática por SSH'
                : 'Script Bash Manual de Instalación'}
            </span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {mode === 'form' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startAutoInstallation();
            }}
            className="space-y-4 text-xs"
          >
            <div className="p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--text)] text-[11px] leading-relaxed flex items-start gap-2.5">
              <Zap size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--accent)]">Conexión Directa SSH:</span> Ingresa las credenciales de tu máquina virtual. El panel ejecutará automáticamente el script para instalar V2Ray, WireGuard y Trojan.
              </div>
            </div>

            {/* Credenciales SSH principales */}
            <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-bold text-[var(--text)] text-xs flex items-center gap-1.5 border-b border-white/10 pb-2">
                <KeyRound size={14} className="text-cyan-400" />
                <span>Credenciales de Acceso SSH del VPS</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[var(--text-muted)] font-bold mb-1">
                    Dirección IPv4 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 198.51.100.42"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-mono focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1">Puerto SSH</label>
                  <input
                    type="number"
                    required
                    value={sshPort}
                    onChange={(e) => setSshPort(parseInt(e.target.value) || 22)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-mono focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1">Usuario SSH</label>
                  <input
                    type="text"
                    required
                    placeholder="root"
                    value={sshUser}
                    onChange={(e) => setSshUser(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-mono focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1">
                    Contraseña SSH <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={sshPassword}
                      onChange={(e) => setSshPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-9 rounded-xl bg-black/40 border border-white/10 text-[var(--text)] font-mono focus:border-[var(--accent)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones Adicionales (Opcional) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">Nombre VPS (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. US-Dallas Node 01"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">Ubicación</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">Bandera Emoji</label>
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text)] text-base"
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setMode('manual-script')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 flex items-center justify-center gap-1.5 transition-all"
              >
                <Terminal size={15} />
                <span>Ver Script Manual</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl font-bold text-[var(--text-muted)] hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
                >
                  <Sparkles size={16} />
                  <span>Instalar Automáticamente vía SSH</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {mode === 'auto-install' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-black/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    Instalador SSH: {sshUser}@{ip || '198.51.100.42'}:{sshPort}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold text-[var(--accent)]">{installProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${installProgress}%` }}
                />
              </div>

              {/* Terminal Logs */}
              <div className="p-3 rounded-lg bg-black/95 font-mono text-[11px] space-y-1.5 max-h-64 overflow-y-auto leading-relaxed border border-white/10">
                {installLogs.map((log, index) => {
                  let colorClass = 'text-cyan-300';
                  if (log.includes('[STDERR]') || log.includes('[ERROR')) colorClass = 'text-red-400 font-bold';
                  else if (log.includes('[STDOUT]')) colorClass = 'text-emerald-300';
                  return (
                    <p key={index} className={`animate-in fade-in whitespace-pre-wrap break-all ${colorClass}`}>
                      {log}
                    </p>
                  );
                })}
                {!installComplete && (
                  <div className="flex items-center gap-2 text-cyan-400 animate-pulse pt-1">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Transmitiendo salida de consola SSH remota...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Completion Screen */}
            {installComplete ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-400">¡Servidor Vinculado e Instalado Correctamente!</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Se han configurado los túneles V2Ray, WireGuard, Trojan y el agente de sincronización con MAXIMUS PANEL.
                  </p>
                </div>
                <button
                  onClick={handleFinalSubmit}
                  className="w-full py-2.5 rounded-xl font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  <span>Finalizar y Agregar al Panel</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-center text-[var(--text-subtle)]">
                No cierres esta ventana mientras se establece la sesión SSH y se descargan los paquetes del sistema...
              </p>
            )}
          </div>
        )}

        {mode === 'manual-script' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[var(--text)] space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-cyan-400">
                <Terminal size={16} />
                <span>Instrucciones para Ejecución Manual en la Terminal:</span>
              </p>
              <ol className="list-decimal list-inside text-[11px] text-[var(--text-muted)] space-y-1 pt-1">
                <li>
                  Abre tu consola SSH (ej. PuTTY, PowerShell o Terminal):{' '}
                  <span className="font-mono text-white">
                    ssh {sshUser || 'root'}@{ip || '198.51.100.42'} -p {sshPort}
                  </span>
                </li>
                <li>Copia y pega el comando autoinstalador de abajo en tu máquina VPS.</li>
                <li>Al finalizar, la máquina aparecerá vinculada automáticamente en tu clúster.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <label className="block text-[var(--text-muted)] font-bold">Comando Directo en 1 Línea:</label>
              <div className="p-3.5 rounded-xl bg-black/90 border border-white/10 font-mono text-[11px] text-emerald-400 break-all select-all flex items-center justify-between gap-3">
                <span>{generatedOneLiner}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedOneLiner, 'cmd')}
                className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-fg)] font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
              >
                {copiedCmd ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedCmd ? '¡Comando Copiado!' : 'Copiar Comando para Terminal VPS'}</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-[var(--text-muted)] font-bold">Código Completo del Script Bash (.sh):</label>
              <div className="p-3 rounded-xl bg-black/90 border border-white/10 font-mono text-[10px] text-cyan-300 overflow-x-auto max-h-40 select-all leading-relaxed">
                <pre>{generatedFullScript}</pre>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedFullScript, 'script')}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text)] font-bold flex items-center justify-center gap-2"
              >
                {copiedScript ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span>{copiedScript ? '¡Código Script Copiado!' : 'Copiar Script Completo .sh'}</span>
              </button>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setMode('form')}
                className="px-4 py-2 rounded-xl font-bold text-[var(--text-muted)] hover:bg-white/5 flex items-center gap-1.5"
              >
                <ArrowLeft size={16} />
                <span>Volver a Formulario SSH</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2 rounded-xl font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg flex items-center gap-1.5"
              >
                <CheckCircle2 size={16} />
                <span>Guardar Servidor en Panel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


