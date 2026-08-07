import { VpnClient, VpsServer, Reseller, SystemNotification, Transaction, AuditLog, PricingPlan, ConnectionMethod, MethodCategory } from '../types';

export const INITIAL_SERVERS: VpsServer[] = [];

export const INITIAL_CLIENTS: VpnClient[] = [];

export const INITIAL_RESELLERS: Reseller[] = [];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const PRICING_PLANS: PricingPlan[] = [];

export const INITIAL_CATEGORIES: MethodCategory[] = [
  {
    id: 'cat-personal-default',
    name: 'PERSONAL 🇦🇷',
    description: 'Métodos preestablecidos de Personal CF y CFT',
    iconUrl: '',
    createdAt: '2026-08-01',
  },
];

export const INITIAL_METHODS: ConnectionMethod[] = [
  {
    id: 'method-1',
    categoryId: 'cat-personal-default',
    name: 'PERSONAL CF 1',
    sshHost: 'Sat24.com',
    sshPort: 80,
    protocol: 'SSL + Payload (WebSocket)',
    sni: 'www.fahorro.com',
    payload: 'MKCOL / HTTP/1.9[lf]Host: recargas.personal.com.ar[lf]Expect: 100-continue[crlf][crlf][split][crlf][crlf]GET- // HTTP/1.1[crlf]Host: [CF][crlf]Connection: Upgrade[crlf]User-Agent: [ua][crlf]Upgrade: websocket[crlf][crlf]',
    createdAt: '2026-08-01',
  },
  {
    id: 'method-2',
    categoryId: 'cat-personal-default',
    name: 'PERSONAL CF 2',
    sshHost: 'emailmarketing.personal.com.ar',
    sshPort: 80,
    protocol: 'HTTP DIRECT / PAYLOAD',
    sni: '',
    payload: 'COPY / HTTP/1.1[crlf]Host: recargas.personal.com.ar[crlf][crlf][instant_split][lf][lf]X / HTTP/1.2[crlf]Host: recargas.personal.com.ar[crlf][lf][crlf]GET / HTTP/1.1[crlf]Host: [CF][crlf]Upgrade: websocket[crlf]Connection: Upgrade[crlf][crlf]',
    createdAt: '2026-08-01',
  },
  {
    id: 'method-3',
    categoryId: 'cat-personal-default',
    name: 'PERSONAL CF 3',
    sshHost: 'wap.renxo.com',
    sshPort: 80,
    protocol: 'HTTP DIRECT / PAYLOAD',
    sni: '',
    payload: 'GET / HTTP/1.3[crlf]Host: rexo.personal.com.ar[crlf][crlf][crlf][split][crlf][split]GETT / HTTP/1.1[crlf]Host: [CF][crlf]Connection: Keep-Alive[crlf]Upgrade: websocket[crlf][crlf]',
    createdAt: '2026-08-01',
  },
  {
    id: 'method-4',
    categoryId: 'cat-personal-default',
    name: 'PERSONAL CFT 1',
    sshHost: 'recargas.personal.com.ar',
    sshPort: 80,
    protocol: 'HTTP DIRECT / PAYLOAD',
    sni: '',
    payload: 'GET / HTTP/1.1[crlf]Host: recargas.personal.com.ar[crlf][crlf][split][crlf][crlf]GET- / HTTP/1.1[crlf]Host: [host][lf][lf]GET /suareznet HTTP/1.1[crlf]Host: [CFT][lf]Connection: Upgrade[lf]Upgrade: websocket[lf]User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)[lf][lf]',
    createdAt: '2026-08-01',
  },
  {
    id: 'method-5',
    categoryId: 'cat-personal-default',
    name: 'PERSONAL CFT 2',
    sshHost: 'institucional.telecom.com.ar',
    sshPort: 80,
    protocol: 'HTTP DIRECT / PAYLOAD',
    sni: '',
    payload: 'HEAD / HTTP/1.1[crlf]Host: recargas.personal.com.ar[crlf][crlf][split][crlf][crlf]GET- / HTTP/1.1[crlf]Host: recargas.personal.com.ar[lf][lf]GET / HTTP/1.1[crlf]Host: [CFT][lf]Connection: Upgrade[lf]Upgrade: websocket[lf]User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)[lf][lf][split]',
    createdAt: '2026-08-01',
  },
  {
    id: 'method-6',
    categoryId: 'cat-personal-default',
    name: 'PERSONAL CFT 3',
    sshHost: 'device-api.smarthome.personal.com.ar',
    sshPort: 80,
    protocol: 'HTTP DIRECT / PAYLOAD',
    sni: '',
    payload: 'HEAD / HTTP/1.1[crlf]Host: recargas.personal.com.ar[crlf][crlf][split][crlf][crlf]GET- / HTTP/1.1[crlf]Host: recargas.personal.com.ar[lf][lf]GET / HTTP/1.1[crlf]Host: [CFT][lf]Connection: Upgrade[lf]Upgrade: websocket[lf]User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)[lf][lf][split]',
    createdAt: '2026-08-01',
  },
  {
    id: 'method-7',
    categoryId: 'cat-personal-default',
    name: 'PERSONAL CFT 4',
    sshHost: 'www.personal.com.ar',
    sshPort: 80,
    protocol: 'HTTP DIRECT / PAYLOAD',
    sni: '',
    payload: 'GET / HTTP/1.1[crlf]Host: emailmarketing.personal.com.ar[crlf][crlf][split][crlf][crlf]GET- / HTTP/1.1[crlf]Host: www.personal.com.ar[lf][lf]GET / HTTP/1.1[crlf]Host: [rotate=[CFT]][lf]Connection: Upgrade[lf]Upgrade: websocket[lf]User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)[lf][lf][split]',
    createdAt: '2026-08-01',
  },
];
