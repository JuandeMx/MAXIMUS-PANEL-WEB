import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Bell,
  Plus,
  Palette,
  Search,
  Check,
  Server,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { AccentColor } from '../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    accent,
    setAccent,
    lang,
    setLang,
    toggleSidebar,
    notifications,
    setActiveModal,
    searchQuery,
    setSearchQuery,
    currentUser,
    logout,
  } = useApp();

  const [showAccentPicker, setShowAccentPicker] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard General', subtitle: 'Vista global de servidores, clientes VPN y métricas clave' },
    clients: { title: 'Clientes VPN', subtitle: 'Gestión de usuarios SSH, V2Ray, Trojan y WireGuard' },
    servers: { title: 'Servidores VPS', subtitle: 'Cluster de máquinas en línea y estado de hardware' },
    methods: { title: 'Métodos de Conexión App', subtitle: 'Configuración de payloads, SNI y túneles para la aplicación móvil' },
    resellers: { title: 'Revendedores', subtitle: 'Administración de sub-distribuidores y asignación de créditos' },
    monitor: { title: 'Monitor en Tiempo Real', subtitle: 'Telemetría de tráfico, consumo e hilos activos' },
    notifications: { title: 'Centro de Notificaciones', subtitle: 'Alertas del sistema, eventos y mantenimiento' },
    sales: { title: 'Registro de Ventas', subtitle: 'Historial de transacciones y facturación' },
    reports: { title: 'Reportes y Estadísticas', subtitle: 'Análisis de uso de ancho de banda y tendencias' },
    activity: { title: 'Logs de Auditoría', subtitle: 'Historial de acciones de administración y seguridad' },
    settings: { title: 'Configuración del Sistema', subtitle: 'Ajustes de API, puertos y personalización del panel' },
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Panel de Control', subtitle: 'Administración VPN' };

  const accentOptions: { id: AccentColor; name: string; bg: string }[] = [
    { id: 'cyan', name: 'Cyan Neón', bg: 'bg-cyan-400' },
    { id: 'emerald', name: 'Esmeralda', bg: 'bg-emerald-400' },
    { id: 'purple', name: 'Púrpura VIP', bg: 'bg-purple-400' },
    { id: 'amber', name: 'Ámbar', bg: 'bg-amber-400' },
    { id: 'rose', name: 'Rosa Neón', bg: 'bg-rose-400' },
    { id: 'blue', name: 'Azul Pro', bg: 'bg-blue-400' },
  ];

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 glass-panel border-b border-white/10 backdrop-blur-md">
      {/* Left: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
            <span>{currentTabInfo.title}</span>
          </h1>
          <p className="hidden sm:block text-xs text-[var(--text-subtle)] truncate max-w-md">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="hidden md:flex items-center relative max-w-xs w-full">
        <Search size={16} className="absolute left-3 text-[var(--text-subtle)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar cliente, IP, servidor..."
          className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-white/5 border border-white/10 text-[var(--text)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 text-xs text-[var(--text-subtle)] hover:text-[var(--text)]"
          >
            ×
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Accent Color Picker Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowAccentPicker(!showAccentPicker)}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors"
            title="Personalizar color de acento"
          >
            <Palette size={18} />
          </button>

          {showAccentPicker && (
            <div className="absolute right-0 mt-2 w-48 p-3 rounded-2xl glass-panel shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-bold text-[var(--text)] mb-2">Color de Acento</p>
              <div className="grid grid-cols-3 gap-2">
                {accentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAccent(opt.id);
                      setShowAccentPicker(false);
                    }}
                    className={`flex items-center justify-center p-2 rounded-xl border transition-all ${
                      accent === opt.id
                        ? 'border-[var(--text)] scale-105 shadow-md'
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={opt.name}
                  >
                    <span className={`w-5 h-5 rounded-full ${opt.bg} flex items-center justify-center text-black`}>
                      {accent === opt.id && <Check size={12} />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors flex items-center gap-1.5 border border-white/10"
          title="Cambiar idioma"
        >
          <Globe size={14} />
          <span>{lang.toUpperCase()}</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors"
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors"
          title="Ver Notificaciones"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Info & Logout Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-[var(--text)] leading-tight">{currentUser?.name || 'Administrador'}</p>
            <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider">{currentUser?.role || 'owner'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Cerrar Sesión"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};
