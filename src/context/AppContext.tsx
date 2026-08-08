import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VpnClient,
  VpsServer,
  Reseller,
  SystemNotification,
  Transaction,
  AuditLog,
  ActiveTab,
  ThemeMode,
  AccentColor,
  Language,
  ProtocolType,
  ConnectionMethod,
  MethodCategory,
} from '../types';
import {
  INITIAL_SERVERS,
  INITIAL_CLIENTS,
  INITIAL_RESELLERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_METHODS,
  INITIAL_CATEGORIES,
} from '../data/mockData';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Auth State
  currentUser: SystemUser | null;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  usersList: SystemUser[];
  addSystemAdmin: (adminData: { username: string; email: string; name: string; password?: string }) => Promise<boolean>;
  updateSystemAdmin: (id: string, adminData: Partial<SystemUser>) => Promise<boolean>;
  deleteSystemAdmin: (id: string) => Promise<boolean>;
  selectedAdmin: SystemUser | null;
  setSelectedAdmin: (admin: SystemUser | null) => void;

  // Data Collections
  servers: VpsServer[];
  clients: VpnClient[];
  resellers: Reseller[];
  setResellers: React.Dispatch<React.SetStateAction<Reseller[]>>;
  notifications: SystemNotification[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  methods: ConnectionMethod[];
  categories: MethodCategory[];

  // Actions
  addVpnClient: (client: Omit<VpnClient, 'id' | 'createdAt' | 'downloadUsedMb' | 'uploadUsedMb' | 'activeConnections'>) => void;
  updateVpnClient: (id: string, clientData: Partial<VpnClient>) => void;
  deleteVpnClient: (id: string) => void;
  toggleClientStatus: (id: string) => void;
  extendClientExpiration: (id: string, days: number) => void;
  resetClientHwid: (id: string) => void;

  addVpsServer: (server: Omit<VpsServer, 'id' | 'status' | 'cpuUsage' | 'ramUsage' | 'diskUsage' | 'bandwidthUsedGb' | 'activeTunnels' | 'uptime'>) => void;
  updateVpsServer: (id: string, serverData: Partial<VpsServer>) => void;
  restartVpsServer: (id: string) => Promise<void>;
  deleteVpsServer: (id: string) => void;
  syncAllUsersToNewVps: (targetServer: VpsServer) => Promise<void>;
  removeUserFromNode: (clientId: string, serverId: string) => Promise<void>;

  addConnectionMethod: (method: Omit<ConnectionMethod, 'id' | 'createdAt'>) => void;
  updateConnectionMethod: (id: string, methodData: Partial<Omit<ConnectionMethod, 'id'>>) => void;
  deleteConnectionMethod: (id: string) => void;

  addCategory: (category: Omit<MethodCategory, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, categoryData: Partial<Omit<MethodCategory, 'id'>>) => void;
  deleteCategory: (id: string) => void;

  addReseller: (reseller: Omit<Reseller, 'id' | 'joinedDate' | 'totalSales' | 'activeClientsCount' | 'avatar'>) => void;
  addResellerCredits: (resellerId: string, credits: number, demoCredits?: number) => void;

  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addAuditLog: (action: string, category: AuditLog['category'], status?: AuditLog['status']) => void;

  selectedReseller: Reseller | null;
  setSelectedReseller: (reseller: Reseller | null) => void;
  selectedCategory: MethodCategory | null;
  setSelectedCategory: (category: MethodCategory | null) => void;

  // Modals & Active Selections
  activeModal: 'new-client' | 'edit-client' | 'client-qr' | 'new-server' | 'new-reseller' | 'reseller-clients' | 'new-admin' | 'edit-admin' | 'new-method' | 'edit-method' | 'new-category' | 'edit-category' | null;
  setActiveModal: (modal: 'new-client' | 'edit-client' | 'client-qr' | 'new-server' | 'new-reseller' | 'reseller-clients' | 'new-admin' | 'edit-admin' | 'new-method' | 'edit-method' | 'new-category' | 'edit-category' | null) => void;
  selectedClient: VpnClient | null;
  setSelectedClient: (client: VpnClient | null) => void;
  selectedServer: VpsServer | null;
  setSelectedServer: (server: VpsServer | null) => void;
  selectedMethod: ConnectionMethod | null;
  setSelectedMethod: (method: ConnectionMethod | null) => void;

  // Search & Global Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accent, setAccent] = useState<AccentColor>('cyan');
  const [lang, setLang] = useState<Language>('es');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Data states
  const [servers, setServers] = useState<VpsServer[]>(() => {
    try {
      const saved = localStorage.getItem('maximus_servers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SERVERS || [];
  });

  const [clients, setClients] = useState<VpnClient[]>(() => {
    try {
      const saved = localStorage.getItem('maximus_clients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CLIENTS || [];
  });

  const [resellers, setResellers] = useState<Reseller[]>(() => {
    try {
      const saved = localStorage.getItem('maximus_resellers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RESELLERS || [];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS || []);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS || []);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS || []);

  const [methods, setMethods] = useState<ConnectionMethod[]>(() => {
    try {
      const saved = localStorage.getItem('maximus_methods');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_METHODS || [];
  });

  const [categories, setCategories] = useState<MethodCategory[]>(() => {
    try {
      const saved = localStorage.getItem('maximus_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CATEGORIES || [];
  });

  // Save data to localStorage on changes
  // Polling métricas reales del VPS (CPU, RAM, Disco, Uptime, Tráfico Real e Hilos de Servicios)
  useEffect(() => {
    let isMounted = true;
    const fetchVpsMetrics = async () => {
      if (!servers || servers.length === 0) return;

      try {
        const updatedServers = await Promise.all(
          servers.map(async (srv) => {
            try {
              const res = await fetch(`/api/vps/metrics?ip=${srv.ip}`);
              if (res.ok) {
                const data = await res.json();
                if (data.status === 'online') {
                  const sentGb = data.bytesSent ? data.bytesSent / (1024 ** 3) : 0;
                  const recvGb = data.bytesRecv ? data.bytesRecv / (1024 ** 3) : 0;
                  const totalGb = roundToTwoDecimals(sentGb + recvGb);

                  return {
                    ...srv,
                    domainCf: srv.domainCf,
                    domainCft: srv.domainCft,
                    status: 'online' as const,
                    cpuUsage: data.cpuUsage ?? srv.cpuUsage,
                    ramUsage: data.ramUsage ?? srv.ramUsage,
                    ramTotalGb: data.ramTotalGb ?? srv.ramTotalGb,
                    diskUsage: data.diskUsage ?? srv.diskUsage,
                    diskTotalGb: data.diskTotalGb ?? srv.diskTotalGb,
                    bandwidthUsedGb: totalGb > 0 ? totalGb : srv.bandwidthUsedGb,
                    bytesSent: data.bytesSent,
                    bytesRecv: data.bytesRecv,
                    activeServices: data.activeServices,
                    uptime: data.uptime ?? srv.uptime,
                  };
                }
              }
            } catch (e) {}
            return srv;
          })
        );

        if (isMounted) {
          setServers(updatedServers);
        }
      } catch (e) {}
    };

    const roundToTwoDecimals = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

    fetchVpsMetrics();
  }, [servers.length]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(() => {
    try {
      const saved = localStorage.getItem('maximus_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [usersList, setUsersList] = useState<SystemUser[]>([]);

  // Modal & Selection
  const [activeModal, setActiveModal] = useState<AppContextType['activeModal']>(null);
  const [selectedClient, setSelectedClient] = useState<VpnClient | null>(null);
  const [selectedServer, setSelectedServer] = useState<VpsServer | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<SystemUser | null>(null);
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<ConnectionMethod | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MethodCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeModalRef = React.useRef(activeModal);
  const isDbLoadedRef = React.useRef(false);
  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  // Sincronizar datos globales desde el backend (/api/db/sync)
  useEffect(() => {
    const fetchBackendDb = async () => {
      // Si hay una ventana modal abierta (editando categoría, método, cliente, etc.), NO hacer fetch ni sobrescribir
      if (activeModalRef.current) return;

      try {
        const res = await fetch('/api/db/sync');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.servers) && data.servers.length > 0) {
            setServers(data.servers);
            localStorage.setItem('maximus_servers', JSON.stringify(data.servers));
          }
          if (Array.isArray(data.clients) && data.clients.length > 0) {
            setClients(data.clients);
            localStorage.setItem('maximus_clients', JSON.stringify(data.clients));
          }
          if (Array.isArray(data.resellers) && data.resellers.length > 0) {
            setResellers(data.resellers);
            localStorage.setItem('maximus_resellers', JSON.stringify(data.resellers));
          }
          if (Array.isArray(data.methods)) {
            setMethods(data.methods);
            localStorage.setItem('maximus_methods', JSON.stringify(data.methods));
          }
          if (Array.isArray(data.categories)) {
            setCategories(data.categories);
            localStorage.setItem('maximus_categories', JSON.stringify(data.categories));
          }
          if (Array.isArray(data.users) && data.users.length > 0) {
            setUsersList(data.users);
          } else {
            setUsersList([
              {
                id: 'usr_admin_owner',
                username: 'admin',
                email: 'admin@maximus.com',
                name: 'Administrador Principal',
                role: 'owner',
                credits: 9999,
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        }
      } catch (e) {
        console.warn('Backend DB sync unavailable:', e);
      } finally {
        isDbLoadedRef.current = true;
      }
    };
    fetchBackendDb();
  }, []);

  // Función de Autenticación
  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        localStorage.setItem('maximus_user', JSON.stringify(data.user));
        localStorage.setItem('maximus_token', data.token);
        return true;
      }
    } catch (e) {}

    // Fallback local instantáneo para usuario admin / admin o cualquier usuario registrado en la lista
    const cleanUser = username.trim().toLowerCase();
    if ((cleanUser === 'admin' || cleanUser === 'admin@maximus.com') && pass === 'admin') {
      const adminUser: SystemUser = {
        id: 'usr_admin_owner',
        username: 'admin',
        email: 'admin@maximus.com',
        name: 'Administrador Principal',
        role: 'owner',
        credits: 9999,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(adminUser);
      localStorage.setItem('maximus_user', JSON.stringify(adminUser));
      localStorage.setItem('maximus_token', 'token_local_admin');
      return true;
    }

    // Buscar en la lista de usuarios locales (Admins)
    const foundLocal = usersList.find(
      (u) => (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser) && u.password === pass
    );

    if (foundLocal) {
      const { password: _, ...userNoPass } = foundLocal;
      setCurrentUser(userNoPass as SystemUser);
      localStorage.setItem('maximus_user', JSON.stringify(userNoPass));
      localStorage.setItem('maximus_token', `token_${foundLocal.id}`);
      return true;
    }

    // Buscar en la lista de Revendedores locales
    const foundReseller = resellers.find(
      (r) =>
        ((r.username && r.username.toLowerCase() === cleanUser) ||
          (r.email && r.email.toLowerCase() === cleanUser) ||
          r.name.toLowerCase() === cleanUser) &&
        (r.password ? r.password === pass : pass === '123456')
    );

    if (foundReseller) {
      const resellerUser: SystemUser = {
        id: foundReseller.id,
        username: foundReseller.username || foundReseller.name.toLowerCase().replace(/\s+/g, '_'),
        email: foundReseller.email,
        name: foundReseller.name,
        role: 'reseller',
        credits: foundReseller.credits || 0,
        createdAt: foundReseller.joinedDate || new Date().toISOString(),
      };
      setCurrentUser(resellerUser);
      setActiveTab('clients');
      localStorage.setItem('maximus_user', JSON.stringify(resellerUser));
      localStorage.setItem('maximus_token', `token_${foundReseller.id}`);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('maximus_user');
    localStorage.removeItem('maximus_token');
  };

  const addSystemAdmin = async (adminData: { username: string; email: string; name: string; password?: string }): Promise<boolean> => {
    const newAdmin: SystemUser = {
      id: `usr_${Date.now()}`,
      username: adminData.username,
      email: adminData.email,
      name: adminData.name,
      password: adminData.password || 'admin123',
      role: 'subadmin',
      credits: 9999,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...usersList, newAdmin];
    setUsersList(updatedUsers);

    try {
      await fetch('/api/db/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: updatedUsers }),
      });
      return true;
    } catch (e) {}
    return false;
  };

  const updateSystemAdmin = async (id: string, adminData: Partial<SystemUser>): Promise<boolean> => {
    const updatedUsers = usersList.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          ...adminData,
        };
      }
      return u;
    });

    setUsersList(updatedUsers);

    // Si editaste tu propio usuario Admin activo, actualizar currentUser
    if (currentUser && currentUser.id === id) {
      const updatedSelf = { ...currentUser, ...adminData };
      delete updatedSelf.password;
      setCurrentUser(updatedSelf);
      localStorage.setItem('maximus_user', JSON.stringify(updatedSelf));
    }

    try {
      await fetch('/api/db/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: updatedUsers }),
      });
      return true;
    } catch (e) {}
    return false;
  };

  const deleteSystemAdmin = async (id: string): Promise<boolean> => {
    const updatedUsers = usersList.filter((u) => u.id !== id);
    setUsersList(updatedUsers);

    try {
      await fetch('/api/db/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: updatedUsers }),
      });
      return true;
    } catch (e) {}
    return false;
  };

  // Guardar datos persistentemente en el backend al modificar estado local
  useEffect(() => {
    if (!isDbLoadedRef.current) return;

    const syncToBackend = async () => {
      try {
        await fetch('/api/db/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ servers, clients, resellers, methods, categories }),
        }).catch(() => {});
      } catch (e) {}
    };

    localStorage.setItem('maximus_servers', JSON.stringify(servers));
    localStorage.setItem('maximus_clients', JSON.stringify(clients));
    localStorage.setItem('maximus_resellers', JSON.stringify(resellers));
    localStorage.setItem('maximus_methods', JSON.stringify(methods));
    localStorage.setItem('maximus_categories', JSON.stringify(categories));
    syncToBackend();
  }, [servers, clients, resellers, methods, categories]);

  useEffect(() => {
    try {
      localStorage.setItem('maximus_methods', JSON.stringify(methods));
      localStorage.setItem('maximus_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [methods, categories]);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    root.setAttribute('data-accent', accent);
  }, [theme, accent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const addAuditLog = (action: string, category: AuditLog['category'], status: AuditLog['status'] = 'success') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'admin_ju',
      ip: '190.120.45.1',
      action,
      category,
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const syncClientToAllVpsNodes = async (action: 'create' | 'renew' | 'delete', username: string, password?: string, days?: number) => {
    try {
      if (!servers || servers.length === 0) return;
      await fetch('/api/vps/sync-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vpsList: servers.map((s) => ({ ip: s.ip, token: 'maximus_secret_node_key_2026' })),
          action,
          clientData: { username, password, days: days || 30 }
        })
      });
    } catch (e) {
      console.warn('Sync API offline, guardando en estado local:', e);
    }
  };

  const addVpnClient: AppContextType['addVpnClient'] = (clientData) => {
    const newId = `usr-${Math.floor(100 + Math.random() * 900)}`;
    const initialNodes = clientData.nodeList && clientData.nodeList.length > 0
      ? clientData.nodeList
      : servers.map((s) => ({ serverId: s.id, serverName: s.name, ip: s.ip }));

    const newClient: VpnClient = {
      ...clientData,
      id: newId,
      downloadUsedMb: 0,
      uploadUsedMb: 0,
      activeConnections: 0,
      createdAt: new Date().toISOString().split('T')[0],
      nodeList: initialNodes,
    };
    setClients((prev) => [newClient, ...prev]);
    addAuditLog(`Creado cliente VPN "${clientData.username}" (${clientData.protocol}) en ${clientData.serverName}`, 'Client');

    // Sincronizar usuario a los VPS seleccionados
    const targetVpsList = initialNodes.map((n) => ({ ip: n.ip, token: 'maximus_secret_node_key_2026' }));
    if (targetVpsList.length > 0) {
      let daysCount = (clientData as any).validityDays;
      if (!daysCount && clientData.expirationDate) {
        const today = new Date();
        const exp = new Date(clientData.expirationDate);
        const diffTime = exp.getTime() - today.getTime();
        daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      fetch('/api/vps/sync-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vpsList: targetVpsList,
          action: 'create',
          clientData: { username: clientData.username, password: clientData.uuidOrPassword, days: daysCount || 30 }
        })
      }).catch((e) => console.warn('Sync API offline:', e));
    }
  };

  const resetClientHwid = (id: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            hwid: undefined,
            hwidLocked: false,
            lastConnectedHwid: undefined,
          };
        }
        return c;
      })
    );
    const target = clients.find((c) => c.id === id);
    addAuditLog(`Restablecido HWID (Dispositivo) del cliente "${target?.username || id}"`, 'Client');
  };

  const syncAllUsersToNewVps = async (targetServer: VpsServer) => {
    if (!clients || clients.length === 0) return;

    for (const client of clients) {
      try {
        await fetch('/api/vps/sync-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vpsList: [{ ip: targetServer.ip, token: 'maximus_secret_node_key_2026' }],
            action: 'create',
            clientData: { username: client.username, password: client.uuidOrPassword, days: 30 }
          })
        });
      } catch (e) {}
    }

    // Actualizar la lista de nodos de los clientes
    setClients((prev) =>
      prev.map((c) => {
        const exists = c.nodeList?.some((n) => n.serverId === targetServer.id);
        if (exists) return c;
        const updatedNodes = [...(c.nodeList || []), { serverId: targetServer.id, serverName: targetServer.name, ip: targetServer.ip }];
        return { ...c, nodeList: updatedNodes };
      })
    );

    addAuditLog(`Sincronizados ${clients.length} usuarios en la nueva VPS "${targetServer.name}"`, 'Server');
  };

  const removeUserFromNode = async (clientId: string, serverId: string) => {
    const targetClient = clients.find((c) => c.id === clientId);
    const targetServer = servers.find((s) => s.id === serverId);

    if (!targetClient || !targetServer) return;

    try {
      await fetch('/api/vps/sync-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vpsList: [{ ip: targetServer.ip, token: 'maximus_secret_node_key_2026' }],
          action: 'delete',
          clientData: { username: targetClient.username }
        })
      });
    } catch (e) {}

    // Remover nodo específico de la lista del usuario
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const filteredNodes = (c.nodeList || []).filter((n) => n.serverId !== serverId);
          return { ...c, nodeList: filteredNodes };
        }
        return c;
      })
    );

    addAuditLog(`Removido usuario "${targetClient.username}" del servidor "${targetServer.name}"`, 'Client', 'warning');
  };

  const updateVpnClient: AppContextType['updateVpnClient'] = (id, clientData) => {
    const target = clients.find((c) => c.id === id);

    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...clientData } : c))
    );

    if (target) {
      addAuditLog(`Actualizados datos del cliente VPN "${clientData.username || target.username}"`, 'Client');

      // Si se cambió el nombre de usuario o la contraseña/UUID, forzar desconexión inmediata borrando el antiguo y creando el nuevo en la VPS
      if (clientData.username && clientData.username !== target.username) {
        syncClientToAllVpsNodes('delete', target.username);
      }

      let calcDays = (clientData as any).validityDays;
      if (!calcDays && clientData.expirationDate) {
        const today = new Date();
        const exp = new Date(clientData.expirationDate);
        const diffTime = exp.getTime() - today.getTime();
        calcDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      syncClientToAllVpsNodes(
        'create',
        clientData.username || target.username,
        clientData.uuidOrPassword || target.uuidOrPassword,
        calcDays || 30
      );
    }
  };

  const deleteVpnClient = (id: string) => {
    const target = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      addAuditLog(`Eliminado cliente VPN "${target.username}"`, 'Client', 'warning');
      syncClientToAllVpsNodes('delete', target.username);
    }
  };

  const toggleClientStatus = (id: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === 'active' || c.status === 'online' ? 'suspended' : 'active';
          addAuditLog(`Cambiado estado de cliente "${c.username}" a ${newStatus}`, 'Client');
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const extendClientExpiration = (id: string, days: number) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const curr = new Date(c.expirationDate);
          curr.setDate(curr.getDate() + days);
          const newExp = curr.toISOString().split('T')[0];
          addAuditLog(`Extendida licencia de "${c.username}" por ${days} días (nueva exp: ${newExp})`, 'Client');
          return { ...c, expirationDate: newExp, status: 'active' };
        }
        return c;
      })
    );
  };

  const addVpsServer: AppContextType['addVpsServer'] = (serverData) => {
    const newId = `srv-0${servers.length + 1}`;
    const newServer: VpsServer = {
      ...serverData,
      id: newId,
      status: 'online',
      cpuUsage: 12,
      ramUsage: 25,
      diskUsage: 15,
      bandwidthUsedGb: 0,
      activeTunnels: 0,
      uptime: 'Justo ahora',
    };
    setServers((prev) => [...prev, newServer]);
    addAuditLog(`Registrado nuevo servidor VPS "${serverData.name}" (${serverData.ip})`, 'Server');

    // Sincronizar todos los usuarios existentes en la nueva VPS
    syncAllUsersToNewVps(newServer);
  };

  const updateVpsServer: AppContextType['updateVpsServer'] = (id, serverData) => {
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...serverData } : s))
    );
    const target = servers.find((s) => s.id === id);
    if (target) {
      addAuditLog(`Actualizado servidor VPS "${target.name}" (${target.ip})`, 'Server');
    }
  };

  const restartVpsServer = async (id: string) => {
    const target = servers.find((s) => s.id === id);
    if (!target) return;

    // Set server to reboot state
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'maintenance', cpuUsage: 99, uptime: 'Reiniciando...' } : s))
    );
    addAuditLog(`Iniciado reinicio remoto del servidor "${target.name}"`, 'Server', 'warning');

    // Simulate server boot process
    await new Promise((res) => setTimeout(res, 3000));

    setServers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'online', cpuUsage: 14, ramUsage: 30, uptime: '0 días, 01 min' } : s
      )
    );
    addAuditLog(`Servidor "${target.name}" reiniciado con éxito y en línea`, 'Server');
  };

  const deleteVpsServer = (id: string) => {
    const target = servers.find((s) => s.id === id);
    setServers((prev) => prev.filter((s) => s.id !== id));
    if (target) {
      addAuditLog(`Eliminado servidor VPS "${target.name}" del panel`, 'Server', 'error');
    }
  };

  const addConnectionMethod: AppContextType['addConnectionMethod'] = (methodData) => {
    const newId = `method-${Date.now()}`;
    const newMethod: ConnectionMethod = {
      ...methodData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMethods((prev) => [...prev, newMethod]);
    addAuditLog(`Añadido nuevo método de conexión "${methodData.name}"`, 'Server');
  };

  const updateConnectionMethod: AppContextType['updateConnectionMethod'] = (id, methodData) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...methodData } : m))
    );
    const target = methods.find((m) => m.id === id);
    if (target) {
      addAuditLog(`Actualizado método de conexión "${target.name}"`, 'Server');
    }
  };

  const deleteConnectionMethod: AppContextType['deleteConnectionMethod'] = (id) => {
    const target = methods.find((m) => m.id === id);
    setMethods((prev) => prev.filter((m) => m.id !== id));
    if (target) {
      addAuditLog(`Eliminado método de conexión "${target.name}"`, 'Server', 'warning');
    }
  };

  const addCategory: AppContextType['addCategory'] = (categoryData) => {
    const newId = `cat-${Date.now()}`;
    const newCategory: MethodCategory = {
      ...categoryData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCategories((prev) => [...prev, newCategory]);
    addAuditLog(`Añadida nueva categoría "${categoryData.name}"`, 'Server');
  };

  const updateCategory: AppContextType['updateCategory'] = (id, categoryData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...categoryData } : c))
    );
    const target = categories.find((c) => c.id === id);
    if (target) {
      addAuditLog(`Actualizada categoría "${target.name}"`, 'Server');
    }
  };

  const deleteCategory: AppContextType['deleteCategory'] = (id) => {
    const target = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Also delete methods belonging to this category
    setMethods((prev) => prev.filter((m) => m.categoryId !== id));
    if (target) {
      addAuditLog(`Eliminada categoría "${target.name}" y sus métodos asociadas`, 'Server', 'warning');
    }
  };

  const addReseller: AppContextType['addReseller'] = (resellerData) => {
    const newReseller: Reseller = {
      ...resellerData,
      id: `res-0${resellers.length + 1}`,
      joinedDate: new Date().toISOString().split('T')[0],
      demoCredits: resellerData.demoCredits || 10,
      totalSales: 0,
      activeClientsCount: 0,
      avatar: resellerData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase(),
    };
    setResellers((prev) => [newReseller, ...prev]);
    addAuditLog(`Añadido nuevo revendedor "${resellerData.name}" (${resellerData.role})`, 'Billing');
  };

  const addResellerCredits = (resellerId: string, credits: number, demoCredits: number = 0) => {
    setResellers((prev) =>
      prev.map((r) => {
        if (r.id === resellerId) {
          addAuditLog(`Asignados ${credits} créditos de venta y ${demoCredits} demos a revendedor "${r.name}"`, 'Billing');
          return {
            ...r,
            credits: (r.credits || 0) + credits,
            demoCredits: (r.demoCredits || 0) + demoCredits,
          };
        }
        return r;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        toggleTheme,
        accent,
        setAccent,
        lang,
        setLang,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,

        currentUser,
        login,
        logout,
        usersList,
        addSystemAdmin,
        updateSystemAdmin,
        deleteSystemAdmin,
        selectedAdmin,
        setSelectedAdmin,

        servers,
        clients,
        resellers,
        setResellers,
        notifications,
        transactions,
        auditLogs,
        methods,
        categories,

        addVpnClient,
        updateVpnClient,
        deleteVpnClient,
        toggleClientStatus,
        extendClientExpiration,
        resetClientHwid,

        addVpsServer,
        updateVpsServer,
        restartVpsServer,
        deleteVpsServer,
        syncAllUsersToNewVps,
        removeUserFromNode,

        addConnectionMethod,
        updateConnectionMethod,
        deleteConnectionMethod,

        addCategory,
        updateCategory,
        deleteCategory,

        addReseller,
        addResellerCredits,

        markNotificationRead,
        clearNotifications,
        addAuditLog,

        activeModal,
        setActiveModal,
        selectedClient,
        setSelectedClient,
        selectedServer,
        setSelectedServer,
        selectedReseller,
        setSelectedReseller,
        selectedMethod,
        setSelectedMethod,
        selectedCategory,
        setSelectedCategory,

        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
