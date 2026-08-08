import express from 'express';
import cors from 'cors';
import { Client } from 'ssh2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir la interfaz gráfica compilada de React (dist / public)
const DIST_DIR = path.join(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}
app.use(express.static(process.cwd()));

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const DB_FILE = path.join(DATA_DIR, 'maximus_db.json');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Servir la carpeta de uploads públicamente
app.use('/uploads', express.static(UPLOADS_DIR));

// Initial DB Structure
const initialDb = {
  users: [
    {
      id: 'usr_admin_owner',
      username: 'admin',
      email: 'admin@maximus.com',
      password: 'admin', // default password
      role: 'owner', // owner, subadmin, reseller
      name: 'Administrador Principal',
      credits: 9999,
      createdAt: new Date().toISOString(),
    }
  ],
  servers: [],
  clients: [],
  resellers: [],
};

// Load or Initialize DB
const getDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando DB:', e);
    return initialDb;
  }
};

const saveDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error guardando DB:', e);
  }
};

// Endpoint: Autenticación / Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const db = getDb();
  const cleanUser = username.trim().toLowerCase();

  // Search in System Admins / Owners
  let user = db.users.find(
    (u) => (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser) && u.password === password
  );

  let userRole = user ? user.role : 'reseller';

  // If not found in users, search in Resellers list
  if (!user && db.resellers) {
    const resellerObj = db.resellers.find(
      (r) =>
        ((r.username && r.username.toLowerCase() === cleanUser) ||
          (r.email && r.email.toLowerCase() === cleanUser) ||
          r.name.toLowerCase() === cleanUser) &&
        (r.password ? r.password === password : password === '123456')
    );

    if (resellerObj) {
      user = {
        id: resellerObj.id,
        username: resellerObj.username || resellerObj.name.toLowerCase().replace(/\s+/g, '_'),
        email: resellerObj.email,
        name: resellerObj.name,
        role: 'reseller',
        credits: resellerObj.credits || 0,
        createdAt: resellerObj.joinedDate || new Date().toISOString(),
      };
      userRole = 'reseller';
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
  }

  // Token de sesión simple
  const token = `token_${user.id}_${Date.now()}`;
  const { password: _, ...userWithoutPass } = user;

  res.json({
    token,
    user: userWithoutPass,
  });
});

// Endpoint: Sincronización global (GET)
app.get('/api/db/sync', (req, res) => {
  const db = getDb();
  // Quitar contraseñas de la lista de usuarios por seguridad
  const safeUsers = db.users.map(({ password, ...u }) => u);
  res.json({
    ...db,
    users: safeUsers,
  });
});

// Endpoint: Actualizar datos globales (POST)
app.post('/api/db/update', (req, res) => {
  const { servers, clients, resellers, users } = req.body;
  const db = getDb();

  if (servers !== undefined) db.servers = servers;
  if (clients !== undefined) db.clients = clients;
  if (resellers !== undefined) db.resellers = resellers;
  if (req.body.methods !== undefined) db.methods = req.body.methods;
  if (req.body.categories !== undefined) db.categories = req.body.categories;
  if (users !== undefined) {
    // Preservar contraseñas existentes si se envían usuarios sin contraseña
    db.users = users.map((u) => {
      const existing = db.users.find((ex) => ex.id === u.id);
      return {
        ...u,
        password: u.password || existing?.password || 'admin123',
      };
    });
  }

  saveDb(db);
  res.json({ status: 'SUCCESS', message: 'Datos guardados correctamente' });
});

// Endpoint: Subida de imágenes de categorías desde la PC o Teléfono al VPS
app.post('/api/upload', (req, res) => {
  try {
    const { imageBase64, fileName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No se envió ninguna imagen.' });
    }

    // Extraer extensión y datos en limpio de Base64
    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    let ext = 'png';
    let dataBuffer;

    if (matches && matches.length === 3) {
      ext = matches[1];
      dataBuffer = Buffer.from(matches[2], 'base64');
    } else {
      dataBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    }

    const cleanFileName = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, cleanFileName);

    fs.writeFileSync(filePath, dataBuffer);

    // Obtener host o IP pública del VPS
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const fileUrl = `${protocol}://${host}/uploads/${cleanFileName}`;

    res.json({
      status: 'SUCCESS',
      url: fileUrl,
      fileName: cleanFileName,
    });
  } catch (e) {
    console.error('Error guardando imagen en VPS:', e);
    res.status(500).json({ error: 'Error interno al guardar la imagen en el VPS.' });
  }
});

// Endpoint de Validación y Vinculación HWID para la App Móvil (Handshake)
app.all(['/api/auth/connect', '/api/auth/client'], (req, res) => {
  try {
    const username = req.body?.username || req.query?.username || req.body?.user || req.query?.user;
    const password = req.body?.password || req.query?.password || req.body?.pass || req.query?.pass;
    const hwid = req.body?.hwid || req.query?.hwid || req.body?.deviceId || req.query?.deviceId;

    if (!username || !hwid) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Faltan parámetros requeridos (username y hwid).'
      });
    }

    const db = getDb();
    if (!db.clients) db.clients = [];
    let clients = db.clients;

    // Buscar al cliente por usuario (insensible a mayúsculas/minúsculas y espacios)
    let clientIndex = clients.findIndex((c) => c.username && c.username.trim().toLowerCase() === username.trim().toLowerCase());
    
    if (clientIndex === -1) {
      // Si el cliente fue creado por terminal/SSH y aún no figura en db.clients, registrarlo automáticamente
      const newClient = {
        id: `usr-${Date.now()}`,
        username: username.trim(),
        protocol: 'SSH',
        serverId: 'srv-01',
        serverName: 'VPS Node',
        ipAddress: req.ip || '127.0.0.1',
        maxConnections: 1,
        activeConnections: 1,
        downloadUsedMb: 0,
        uploadUsedMb: 0,
        bandwidthLimitGb: 100,
        expirationDate: '2026-09-06',
        status: 'active',
        uuidOrPassword: password || '1234',
        createdAt: new Date().toISOString().split('T')[0],
        hwid: hwid,
        hwidLocked: true,
        lastConnectedHwid: hwid,
      };
      db.clients.push(newClient);
      saveDb(db);
      console.log(`[HWID-AUTO-CREATE] Creado y vinculado cliente "${username}" con HWID: ${hwid}`);
      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Dispositivo vinculado exitosamente.',
        username: username,
        hwid: hwid
      });
    }

    const client = clients[clientIndex];

    // Verificar contraseña si se envió
    if (password && client.uuidOrPassword && client.uuidOrPassword !== password) {
      return res.status(401).json({
        status: 'UNAUTHORIZED',
        message: '⚠️ Contraseña incorrecta.'
      });
    }

    // Verificar expiración del usuario
    if (client.expirationDate) {
      const exp = new Date(client.expirationDate);
      const now = new Date();
      if (exp < now) {
        return res.status(403).json({
          status: 'EXPIRED',
          message: '⚠️ Tu cuenta ha expirado. Por favor renueva tu suscripción.'
        });
      }
    }

    // LÓGICA HWID: Vinculación o Validación de Dispositivo Único
    if (!client.hwid) {
      // Primer uso: Vincular HWID del teléfono al cliente
      client.hwid = hwid;
      client.hwidLocked = true;
      client.lastConnectedHwid = hwid;
      db.clients[clientIndex] = client;
      saveDb(db);

      console.log(`[HWID-LINK] Usuario "${username}" vinculado exitosamente al dispositivo HWID: ${hwid}`);
      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Dispositivo vinculado exitosamente.',
        username: client.username,
        hwid: client.hwid
      });
    }

    // Si ya tiene HWID vinculado, verificar que sea exactamente el mismo dispositivo
    if (client.hwid === hwid) {
      client.lastConnectedHwid = hwid;
      db.clients[clientIndex] = client;
      saveDb(db);

      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Acceso autorizado.',
        username: client.username,
        hwid: client.hwid
      });
    } else {
      // El HWID no coincide (intento de compartir cuenta)
      console.warn(`[HWID-DENIED] Intento de acceso no autorizado para "${username}". HWID registrado: ${client.hwid}, HWID entrante: ${hwid}`);
      return res.status(403).json({
        status: 'FORBIDDEN',
        message: '⚠️ Error de Autenticación: Dispositivo no autorizado. Este usuario ya está vinculado a otro teléfono.'
      });
    }
  } catch (e) {
    console.error('Error en /api/auth/connect:', e);
    res.status(500).json({ status: 'ERROR', message: 'Error interno del servidor.' });
  }
});

// Endpoint Público para la App Móvil: Sincronización de Servidores VPS (IP, CF, CFT) y Categorías/Métodos
app.get('/api/app/config', (req, res) => {
  const db = getDb();
  const categories = db.categories || [];
  const methods = db.methods || [];
  const servers = db.servers || [];

  // 1. Mapear Servidores (Máquinas VPS) con campos limpios (id, name, flag, ip, cf, cft)
  const activeServers = servers.map((s) => ({
    id: s.id,
    name: s.name,
    flag: s.flag || '🌐',
    ip: s.ip,
    cf: s.domainCf || s.ip,
    cft: s.domainCft || s.ip,
  }));

  // 2. Mapear Categorías y sus Métodos de Conexión
  const categoryList = categories.map((cat) => {
    const catMethods = methods
      .filter((m) => m.categoryId === cat.id)
      .map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description || '',
        sshHost: m.sshHost || '[IP]',
        sshPort: m.sshPort || 80,
        protocol: m.protocol || 'HTTP DIRECT / PAYLOAD',
        sni: m.sni || '',
        payload: m.payload || '',
      }));

    return {
      id: cat.id,
      name: cat.name,
      iconUrl: cat.iconUrl || '',
      description: cat.description || '',
      configurationsCount: catMethods.length,
      methods: catMethods,
    };
  });

  res.json({
    servers: activeServers,
    categories: categoryList,
  });
});

// Ruta raíz: Estado del servidor backend
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: sans-serif; background: #0f172a; color: #fff; padding: 40px; text-align: center;">
        <h1 style="color: #06b6d4;">🚀 Backend Master Maximus VPS (Puerto 3001)</h1>
        <p>Servidor API de instalación SSH, Persistencia DB y Sincronización Multi-nodo activo.</p>
        <p>Para ver el Panel Web React, entra a: <a href="http://localhost:3000" style="color: #38bdf8;">http://localhost:3000</a></p>
      </body>
    </html>
  `);
});

// Endpoint 1: Health check del backend web
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', message: 'Backend Web Master de Maximus VPS' });
});

// Endpoint 2: Instalación SSH Real de Maximus VPS en Servidor Remoto
app.post('/api/vps/install', (req, res) => {
  const { ip, sshPort = 22, sshUser = 'root', sshPassword } = req.body;

  if (!ip || !sshPassword) {
    return res.status(400).json({ error: 'La IP y la Contraseña SSH son obligatorias.' });
  }

  // Set SSE response headers for real-time progress streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendLog = (message, progress) => {
    res.write(`data: ${JSON.stringify({ message, progress })}\n\n`);
  };

  sendLog(`[1/6] Iniciando conexión SSH hacia ${sshUser}@${ip}:${sshPort}...`, 10);

  const conn = new Client();

  conn.on('ready', () => {
    sendLog(`[2/6] Autenticación SSH exitosa en ${ip}. Verificando sistema operativo...`, 25);

    // Command to install MAXIMUS Node via official repo
    const installCmd = `cd /root; export DEBIAN_FRONTEND=noninteractive; apt-get update -y >/dev/null 2>&1; apt-get install -y git curl python3 >/dev/null 2>&1; rm -rf /tmp/MaximusVpsMx; git clone https://github.com/JuandeMx/MAXIMUS.git /tmp/MaximusVpsMx && cd /tmp/MaximusVpsMx && chmod +x install.sh core/*.py core/*.sh && bash install.sh --slave`;

    sendLog(`[3/6] Descargando y ejecutando instalador MAXIMUS desde GitHub...`, 40);

    conn.exec(installCmd, (err, stream) => {
      if (err) {
        sendLog(`[ERROR SSH]: Falló la ejecución del comando: ${err.message}`, 100);
        conn.end();
        return res.end();
      }

      let pct = 40;

      const processChunk = (prefix, text) => {
        const lines = text.split('\n');
        for (const line of lines) {
          const cleanLine = line.replace(/\x1B\[[0-9;]*[mG]/g, '').trim();
          if (cleanLine) {
            pct = Math.min(pct + 2, 92);
            sendLog(`[${prefix}] ${cleanLine.substring(0, 160)}`, pct);
          }
        }
      };

      stream.on('close', (code, signal) => {
        if (code === 0) {
          sendLog(`[4/6] Configuración de paquetes, comandos (menu/MX) y UFW completada.`, 95);
          sendLog(`[5/6] Maximus Multi-Node API activa en puerto 6767.`, 98);
          sendLog(`[6/6] ¡Servidor VPS ${ip} instalado y emparejado con éxito!`, 100);
        } else {
          sendLog(`[ERROR CÓDIGO ${code}] La instalación SSH finalizó con código de salida ${code}. Revisa los logs anteriores.`, 100);
        }
        conn.end();
        res.end();
      }).on('data', (data) => {
        processChunk('STDOUT', data.toString());
      }).stderr.on('data', (data) => {
        processChunk('STDERR', data.toString());
      });
    });
  }).on('error', (err) => {
    sendLog(`[ERROR SSH CONEXIÓN]: No se pudo conectar por SSH a ${ip}: ${err.message}`, 100);
    res.end();
  }).connect({
    host: ip,
    port: Number(sshPort),
    username: sshUser,
    password: sshPassword,
    readyTimeout: 20000
  });
});

// Endpoint 3: Proxy para Sincronizar Clientes a Nodos VPS (Multi-nodo sync)
app.post('/api/vps/sync-client', async (req, res) => {
  const { vpsList, action, clientData } = req.body;

  if (!vpsList || !Array.isArray(vpsList) || vpsList.length === 0) {
    return res.status(400).json({ error: 'Debes proporcionar la lista de VPS a sincronizar.' });
  }

  const results = [];

  for (const node of vpsList) {
    try {
      const targetUrl = `http://${node.ip}:6767/api/v1/client/${action || 'create'}`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': node.token || 'maximus_secret_node_key_2026'
        },
        body: JSON.stringify(clientData)
      });
      const data = await response.json();
      results.push({ ip: node.ip, status: 'SUCCESS', data });
    } catch (err) {
      results.push({ ip: node.ip, status: 'FAILED', error: err.message });
    }
  }

  res.json({ success: true, results });
});

// Endpoint 4: Consultar métricas reales del VPS (CPU, RAM, Disco, Uptime, Usuarios en vivo)
app.get('/api/vps/metrics', async (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.status(400).json({ error: 'IP de VPS requerida' });
  }

  try {
    const response = await fetch(`http://${ip}:6767/api/v1/health`, {
      headers: { 'X-API-KEY': 'maximus_secret_node_key_2026' },
      signal: AbortSignal.timeout(4000)
    });

    if (response.ok) {
      const data = await response.json();
      return res.json({
        status: 'online',
        cpuUsage: data.cpuUsage || 12,
        ramUsage: data.ramUsage || 28,
        ramTotalGb: data.ramTotalGb || 4,
        diskUsage: data.diskUsage || 35,
        diskTotalGb: data.diskTotalGb || 80,
        bytesSent: data.bytesSent || 0,
        bytesRecv: data.bytesRecv || 0,
        activeServices: data.activeServices || {},
        uptime: data.uptime || '1d 4h',
        usersRegistered: data.users_registered || 0
      });
    }
  } catch (e) {
    console.warn(`No se pudo obtener métricas en vivo de ${ip}:`, e.message);
  }

  res.json({
    status: 'offline',
    cpuUsage: 0,
    ramUsage: 0,
    ramTotalGb: 4,
    diskUsage: 0,
    diskTotalGb: 80,
    uptime: 'Offline'
  });
});

// Endpoint 5: Ejecutar Comandos SSH Reales en la VPS desde la Terminal Web
app.post('/api/vps/exec', (req, res) => {
  const { ip, sshPort = 22, sshUser = 'root', sshPassword, command } = req.body;

  if (!ip || !command) {
    return res.status(400).json({ error: 'IP y Comando requeridos.' });
  }

  const conn = new Client();

  conn.on('ready', () => {
    conn.exec(command, (err, stream) => {
      if (err) {
        conn.end();
        return res.status(500).json({ error: err.message });
      }

      let stdout = '';
      let stderr = '';

      stream.on('close', (code) => {
        conn.end();
        res.json({ code, stdout, stderr });
      }).on('data', (data) => {
        stdout += data.toString();
      }).stderr.on('data', (data) => {
        stderr += data.toString();
      });
    });
  }).on('error', (err) => {
    res.status(500).json({ error: `Fallo de conexión SSH a ${ip}: ${err.message}` });
  }).connect({
    host: ip,
    port: Number(sshPort),
    username: sshUser,
    password: sshPassword || 'root',
    readyTimeout: 10000
  });
});

// Captura de rutas frontend SPA de React (Login, Dashboard, etc)
app.get('*', (req, res) => {
  const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(distIndexPath)) {
    return res.sendFile(distIndexPath);
  }
  const rootIndexPath = path.join(process.cwd(), 'index.html');
  if (fs.existsSync(rootIndexPath)) {
    return res.sendFile(rootIndexPath);
  }
  res.send('MAXIMUS PANEL Backend Running');
});

app.listen(PORT, () => {
  console.log(`🚀 MAXIMUS PANEL escuchando en el puerto ${PORT} (http://localhost:${PORT})`);
});
