export type ProtocolType = 'SSH' | 'V2Ray' | 'Trojan' | 'WireGuard' | 'OpenVPN';

export type UserStatus = 'active' | 'expired' | 'suspended' | 'online';

export interface VpnClient {
  id: string;
  username: string;
  protocol: ProtocolType;
  serverId: string;
  serverName: string;
  ipAddress: string;
  maxConnections: number;
  activeConnections: number;
  downloadUsedMb: number;
  uploadUsedMb: number;
  bandwidthLimitGb: number;
  expirationDate: string; // YYYY-MM-DD
  status: UserStatus;
  uuidOrPassword: string;
  configString: string;
  resellerId?: string;
  createdAt: string;
  nodeList?: Array<{ serverId: string; serverName: string; ip: string }>;
}

export interface VpsServer {
  id: string;
  name: string;
  ip: string;
  location: string;
  flag: string;
  os: string;
  status: 'online' | 'offline' | 'maintenance';
  cpuUsage: number; // percentage
  ramUsage: number; // percentage
  ramTotalGb: number;
  diskUsage: number; // percentage
  diskTotalGb: number;
  bandwidthUsedGb: number;
  bandwidthLimitGb: number;
  activeTunnels: number;
  uptime: string;
  installedProtocols: ProtocolType[];
  domainCf?: string;
  domainCft?: string;
  bytesSent?: number;
  bytesRecv?: number;
  activeServices?: Record<string, { status: string; port: string }>;
}

export type UserRole = 'owner' | 'subadmin' | 'reseller';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  createdAt: string;
  password?: string;
}

export interface Reseller {
  id: string;
  name: string;
  username?: string;
  password?: string;
  email: string;
  role: 'Administrador' | 'Revendedor Master' | 'Revendedor Estándar';
  credits: number;
  demoCredits: number;
  totalSales: number;
  activeClientsCount: number;
  commissionPercentage: number;
  status: 'active' | 'inactive';
  joinedDate: string;
  avatar: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  read: boolean;
}

export interface Transaction {
  id: string;
  clientName: string;
  planName: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: 'Credit Card' | 'Crypto' | 'PayPal' | 'Credit Balance';
  status: 'completed' | 'pending' | 'failed';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  ip: string;
  action: string;
  category: 'Security' | 'Client' | 'Server' | 'Billing' | 'System';
  status: 'success' | 'warning' | 'error';
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  vpsCount: number;
  vpsLimit: string;
  maxClients: string;
  bandwidth: string;
  support: string;
  isPopular?: boolean;
  features: string[];
}

export type ThemeMode = 'dark' | 'light';

export type AccentColor = 'cyan' | 'emerald' | 'purple' | 'amber' | 'rose' | 'blue';

export type Language = 'es' | 'en';

export type ActiveTab =
  | 'dashboard'
  | 'clients'
  | 'servers'
  | 'methods'
  | 'resellers'
  | 'monitor'
  | 'notifications'
  | 'sales'
  | 'reports'
  | 'activity'
  | 'settings';

export interface MethodCategory {
  id: string;
  name: string;
  iconUrl?: string; // Image URL or base64 icon
  description?: string;
  createdAt?: string;
}

export interface ConnectionMethod {
  id: string;
  categoryId: string; // Foreign key to MethodCategory
  name: string;
  description?: string; // e.g. "Front Prepago Abono"
  sshHost: string;
  sshPort: number;
  protocol: string;
  sni: string;
  payload: string;
  proxyHost?: string;
  proxyPort?: number;
  nodeName?: string;
  createdAt?: string;
}
