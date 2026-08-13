@echo off
title Onam 2026 Registration Backend Server (Port 3001)
color 0A
echo ============================================================
echo   AMRITA VISHWA VIDYAPEETHAM - ONAM FESTIVAL BACKEND SERVER
echo   Starting Next.js Server on http://localhost:3001 ...
echo ============================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0REGISTRATION\forms"

npm run dev -- -p 3001

pause
