@echo off
title MAXIMUS VPS - PANEL WEB & BACKEND SERVER
color 0A
cls

echo =====================================================================
echo              ⚡ INICIANDO MAXIMUS VPS PANEL WEB ⚡
echo =====================================================================
echo.

cd /d "d:\PANEL WEB"

echo [+] 1/2 Instalando y verificando dependencias necesarias...
call npm install --silent
echo [OK] Dependencias listas.
echo.

echo [+] 2/2 Liberando puertos anteriores (3000 y 3001) si existieran zombies...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo.
echo =====================================================================
echo  [1] Arrancando Servidor Backend API SSH (Puerto 3001)...
echo =====================================================================
start "Maximus Backend API (3001)" cmd /k "cd /d "d:\PANEL WEB" && node server.js"

timeout /t 3 /nobreak >nul

echo.
echo =====================================================================
echo  [2] Arrancando Interfaz Panel Web React (Puerto 3000)...
echo =====================================================================
start "Maximus Web Frontend (3000)" cmd /k "cd /d "d:\PANEL WEB" && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo =====================================================================
echo  ✅ ¡AMBOS SERVIDORES ESTÁN ENCENDIDOS Y OPERATIVOS!
echo =====================================================================
echo  - Panel Web:     http://localhost:3000
echo  - API Backend:   http://localhost:3001
echo =====================================================================
echo.

start http://localhost:3000

echo Presiona cualquier tecla para cerrar esta ventana de inicio...
pause >nul
