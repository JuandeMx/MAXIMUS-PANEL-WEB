#!/bin/bash
# =========================================================
# MAXIMUS PANEL WEB - Standalone Ultra-Fast VPS Installer
# Target: Ubuntu 20.04 - 24.04 LTS / Debian 11 - 12
# Port: 84
# =========================================================

export DEBIAN_FRONTEND=noninteractive

if [ "$EUID" -ne 0 ]; then
  echo -e "\e[1;31m[!] ERROR: Este instalador requiere privilegios de ROOT.\e[0m"
  echo -e "\e[1;33m[TIP] Ejecuta 'sudo su' antes de correr este comando.\e[0m"
  exit 1
fi

echo -e "\n\e[1;36m=========================================================\e[0m"
echo -e "\e[1;33m          MAXIMUS PANEL WEB - INSTALADOR STANDALONE      \e[0m"
echo -e "\e[1;36m=========================================================\e[0m\n"

# 1. Comprobar o instalar Node.js rápidamente sin bloqueos
if ! command -v node &> /dev/null; then
    echo -e "\e[1;36m[+] Instalando Node.js de forma rápida...\e[0m"
    apt-get update -qq
    apt-get install -y -qq nodejs npm git curl >/dev/null 2>&1
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
        apt-get install -y -qq nodejs >/dev/null 2>&1
    fi
fi

INSTALL_DIR="/etc/Maximus-WebPanel"
mkdir -p "$INSTALL_DIR"

echo -e "\e[1;32m[+] Descargando MAXIMUS PANEL WEB desde GitHub...\e[0m"
rm -rf /tmp/Maximus-WebPanel 2>/dev/null
git clone --depth 1 https://github.com/JuandeMx/MAXIMUS-PANEL-WEB.git /tmp/Maximus-WebPanel

cp -r /tmp/Maximus-WebPanel/* "$INSTALL_DIR/" 2>/dev/null
cd "$INSTALL_DIR" || exit

echo -e "\e[1;36m[+] Instalando servidor y preparando archivos estáticos...\e[0m"
npm install --omit=dev --no-audit --no-fund --quiet >/dev/null 2>&1

# Si no está la carpeta dist, compilar
if [ ! -f "$INSTALL_DIR/dist/index.html" ] && [ -f "$INSTALL_DIR/package.json" ]; then
    npm run build --quiet >/dev/null 2>&1
fi

# 2. Configuración de servicio Systemd (Puerto 84)
cat << 'EOF' > /etc/systemd/system/maximus-webpanel.service
[Unit]
Description=Maximus Web Panel Standalone Service (Port 84)
After=network.target

[Service]
User=root
WorkingDirectory=/etc/Maximus-WebPanel
ExecStart=/usr/bin/node /etc/Maximus-WebPanel/server.js
Restart=always
RestartSec=3
Environment=PORT=84

[Install]
WantedBy=multi-user.target
EOF

# Apertura de puerto 84 en Firewall (UFW / iptables)
echo -e "\e[1;36m[+] Abriendo puerto 84 en Firewall del sistema...\e[0m"
ufw allow 84/tcp >/dev/null 2>&1
iptables -A INPUT -p tcp --dport 84 -j ACCEPT >/dev/null 2>&1

systemctl daemon-reload
systemctl enable maximus-webpanel >/dev/null 2>&1
systemctl restart maximus-webpanel >/dev/null 2>&1

MY_IP=$(curl -4 -sL --max-time 3 https://api.ipify.org || hostname -I | awk '{print $1}')

echo -e "\n\e[1;36m=========================================================\e[0m"
echo -e "\e[1;32m   [+] ¡MAXIMUS PANEL WEB INSTALADO CON ÉXITO!           \e[0m"
echo -e "\e[1;33m   🌐 ACCESO WEB: http://$MY_IP:84\e[0m"
echo -e "\e[1;37m   🔑 Usuario: admin  |  Contraseña: admin\e[0m"
echo -e "\e[1;36m=========================================================\e[0m\n"

exit 0
