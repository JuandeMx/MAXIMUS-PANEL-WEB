import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  Shield,
  LayoutDashboard,
  Users,
  Server,
  Zap,
  UserCheck,
  Activity,
  Bell,
  CreditCard,
  BarChart3,
  History,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    toggleSidebar,
    notifications,
    clients,
    servers,
    resellers,
    methods,
    currentUser,
  } = useApp();

  const isReseller = currentUser?.role === 'reseller';

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const activeClientsCount = clients.filter((c) => {
    if (isReseller && c.resellerId !== currentUser?.id) return false;
    return c.status === 'active' || c.status === 'online';
  }).length;
  const onlineServersCount = servers.filter((s) => s.status === 'online').length;

  const allGeneralNav: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    {
      id: 'clients',
      label: 'Clientes VPN',
      icon: <Users size={20} />,
      badge: activeClientsCount,
    },
    {
      id: 'servers',
      label: 'Servidores VPS',
      icon: <Server size={20} />,
      badge: `${onlineServersCount}/${servers.length}`,
    },
    {
      id: 'methods',
      label: 'Métodos App',
      icon: <Zap size={20} />,
      badge: methods ? methods.length : 0,
    },
    {
      id: 'resellers',
      label: 'Revendedores',
      icon: <UserCheck size={20} />,
      badge: resellers.length,
    },
  ];

  const generalNav = isReseller
    ? allGeneralNav.filter((item) => item.id === 'clients')
    : allGeneralNav;

  const operationNav: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = isReseller
    ? []
    : [
        {
          id: 'monitor',
          label: 'Monitor Vivo',
          icon: <Activity size={20} />,
          badge: 'LIVE',
        },
        {
          id: 'notifications',
          label: 'Notificaciones',
          icon: <Bell size={20} />,
          badge: unreadNotifs > 0 ? unreadNotifs : undefined,
        },
        { id: 'sales', label: 'Ventas', icon: <CreditCard size={20} /> },
        { id: 'reports', label: 'Reportes', icon: <BarChart3 size={20} /> },
        { id: 'activity', label: 'Actividad', icon: <History size={20} /> },
        { id: 'settings', label: 'Configuración', icon: <Settings size={20} /> },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <aside
        id="sb"
        className={`fixed lg:static top-0 left-0 h-screen z-50 transition-all duration-300 flex flex-col justify-between select-none glass-panel border-r border-white/10 ${
          sidebarOpen ? 'w-[248px]' : 'w-[74px]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundColor: 'var(--sidebar)' }}
      >
        {/* Upper Brand Section */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-[var(--accent)] shrink-0 glow-accent-sm">
                <Shield size={22} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              {sidebarOpen && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-base tracking-wide text-[var(--text)] whitespace-nowrap">
                    <span>MAXIMUS</span>
                    <span className="text-[var(--accent)]">PANEL</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--text-subtle)] tracking-widest uppercase">
                    VPN & VPS CONTROL
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors"
              title={sidebarOpen ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
            >
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Group General */}
            <div>
              {sidebarOpen && (
                <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-[var(--text-subtle)] uppercase">
                  General
                </p>
              )}
              <div className="space-y-1">
                {generalNav.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-[var(--accent)]' : 'group-hover:text-[var(--text)]'}>
                          {item.icon}
                        </span>
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>

                      {sidebarOpen && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                            isActive
                              ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                              : 'bg-white/10 text-[var(--text-muted)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group Operación */}
            <div>
              {sidebarOpen && (
                <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-[var(--text-subtle)] uppercase">
                  Operación & Sistema
                </p>
              )}
              <div className="space-y-1">
                {operationNav.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-[var(--accent)]' : 'group-hover:text-[var(--text)]'}>
                          {item.icon}
                        </span>
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>

                      {sidebarOpen && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                            item.badge === 'LIVE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                              : item.badge === 'PRO'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : typeof item.badge === 'number'
                              ? 'bg-red-500 text-white'
                              : 'bg-white/10 text-[var(--text-muted)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Lower User Profile Section */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                JU
              </div>
              {sidebarOpen && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[var(--text)] truncate">Juan Usuario</span>
                  <span className="text-[10px] text-[var(--text-subtle)] truncate">Administrador</span>
                </div>
              )}
            </div>

            {sidebarOpen && (
              <button
                onClick={() => setActiveTab('settings')}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Cerrar sesión / Configuración"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
