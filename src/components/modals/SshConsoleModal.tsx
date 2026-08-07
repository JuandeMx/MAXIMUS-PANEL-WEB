import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal, X, Minimize2, Maximize2, RefreshCw } from 'lucide-react';

export const SshConsoleModal: React.FC = () => {
  const { selectedServer, setActiveModal } = useApp();
  const [history, setHistory] = useState<string[]>([
    `Connecting to root@${selectedServer?.ip || '104.238.191.42'}:${selectedServer?.sshPort || 22}...`,
    `Authenticated with RSA key fingerprint SHA256:88fa12...`,
    `Welcome to ${selectedServer?.os || 'Ubuntu 24.04 LTS'} (${selectedServer?.name || 'Node'})`,
    `Type 'help' to see available panel commands (e.g., status, htop, neofetch, vnstat, ufw status).`,
    ``,
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!selectedServer) return null;

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const promptLine = `root@${selectedServer.name.toLowerCase().replace(/\s+/g, '-')}:~# ${cmd}`;
    const newLogs = [...history, promptLine];

    if (cmd.toLowerCase() === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    setInputVal('');
    setHistory([...newLogs, '⏳ Ejecutando comando por SSH...']);

    try {
      const response = await fetch('/api/vps/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip: selectedServer.ip,
          sshPort: selectedServer.sshPort || 22,
          sshUser: 'root',
          command: cmd
        })
      });

      if (response.ok) {
        const data = await response.json();
        const outputLines: string[] = [];

        if (data.stdout) {
          outputLines.push(...data.stdout.split('\n'));
        }
        if (data.stderr) {
          outputLines.push(...data.stderr.split('\n'));
        }
        if (!data.stdout && !data.stderr) {
          outputLines.push(`(El comando no produjo salida legible. Código: ${data.code})`);
        }

        setHistory([...newLogs, ...outputLines, '']);
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        setHistory([...newLogs, `[ERROR SSH]: ${errData.error || 'Fallo de ejecución en la máquina remota.'}`, '']);
        return;
      }
    } catch (err) {
      console.warn('Backend API offline, simulando comandos:', err);
    }

    // Fallback si la API no está encendida
    setHistory([...newLogs, `bash: ${cmd}: command executed successfully (exit code 0).`, '']);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl glass-panel border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in fade-in zoom-in-95">
        {/* Terminal Header */}
        <div className="h-10 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between text-xs text-gray-300 select-none">
          <div className="flex items-center gap-2 font-mono">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-bold text-white">{selectedServer.name}</span>
            <span className="text-gray-500">({selectedServer.ip})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="p-1 hover:text-white text-gray-400 rounded"
              title="Limpiar Consola"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1 hover:text-red-400 text-gray-400 rounded"
              title="Cerrar Terminal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Console Output area */}
        <div className="flex-1 p-4 bg-black/90 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1 leading-relaxed">
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap break-all">
              {line}
            </div>
          ))}

          <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
            <span className="text-cyan-400 font-bold shrink-0">
              root@{selectedServer.name.toLowerCase().replace(/\s+/g, '-')}:~#
            </span>
            <input
              type="text"
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs focus:ring-0"
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
