@echo off
echo ================================
echo Starting Frontend and Backend servers
echo ================================

:: ==============================
:: FRONTEND (React + Vite)
:: ==============================
echo Starting frontend...

cd frontend

:: Install dependencies if node_modules folder does not exist
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

:: Start Vite dev server using npx
start "Frontend" cmd /k "npx vite"

cd ..

:: ==============================
:: BACKEND (Spring Boot)
:: ==============================
echo Starting backend...

cd backend\fkult

:: Check if Maven Wrapper exists, otherwise try mvn
if exist mvnw (
    set MVNCMD=mvnw
) else (
    set MVNCMD=mvn
)

:: Start Spring Boot
start "Backend" cmd /k "%MVNCMD% spring-boot:run"

cd ..\..

echo ================================
echo Both servers have been started.
pause
