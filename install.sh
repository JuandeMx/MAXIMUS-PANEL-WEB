#!/bin/bash
# =========================================================
# MAXIMUS PANEL WEB - Standalone VPS Installer
# Target: Ubuntu 20.04 - 24.04 LTS / Debian 11 - 12
# Port: 84
# =========================================================

if [ "$EUID" -ne 0 ]; then
  echo -e "\e[1;31m[!] ERROR: Este instalador requiere privilegios de ROOT.\e[0m"
  echo -e "\e[1;33m[TIP] Ejecuta 'sudo su' antes de correr este comando.\e[0m"
  exit 1
fi

echo -e "\n\e[1;36m=========================================================\e[0m"
echo -e "\e[1;33m          MAXIMUS PANEL WEB - INSTALADOR STANDALONE      \e[0m"
echo -e "\e[1;36m=========================================================\e[0m\n"

echo -e "\e[1;32m[+] Actualizando paquetes e instalando Node.js / Git...\e[0m"
apt-get update -y >/dev/null 2>&1
apt-get install -y curl git build-essential >/dev/null 2>&1

# Instalación de Node.js v20 LTS si no está presente
if ! command -v node &> /dev/null; then
    echo -e "\e[1;36m[+] Instalando Node.js v20 LTS...\e[0m"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
    apt-get install -y nodejs >/dev/null 2>&1
fi

INSTALL_DIR="/etc/Maximus-WebPanel"
mkdir -p "$INSTALL_DIR"

echo -e "\e[1;32m[+] Descargando archivos de MAXIMUS PANEL WEB desde GitHub...\e[0m"
rm -rf /tmp/Maximus-WebPanel 2>/dev/null
git clone https://github.com/JuandeMx/MAXIMUS-PANEL-WEB.git /tmp/Maximus-WebPanel >/dev/null 2>&1

cp -r /tmp/Maximus-WebPanel/* "$INSTALL_DIR/" 2>/dev/null
cd "$INSTALL_DIR" || exit

echo -e "\e[1;36m[+] Instalando dependencias de Node.js y compilando frontend...\e[0m"
npm install --silent >/dev/null 2>&1
npm run build >/dev/null 2>&1

# Crear servicio Systemd para Puerto 84
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

systemctl daemon-reload
systemctl enable maximus-webpanel >/dev/null 2>&1
systemctl restart maximus-webpanel >/dev/null 2>&1

MY_IP=$(curl -4 -sL https://api.ipify.org || hostname -I | awk '{print $1}')

echo -e "\n\e[1;36m=========================================================\e[0m"
echo -e "\e[1;32m   [+] ¡MAXIMUS PANEL WEB INSTALADO CON ÉXITO!           \e[0m"
echo -e "\e[1;33m   🌐 ACCESO WEB: http://$MY_IP:84\e[0m"
echo -e "\e[1;37m   🔑 Usuario: admin  |  Contraseña: admin\e[0m"
echo -e "\e[1;36m=========================================================\e[0m\n"

exit 0
