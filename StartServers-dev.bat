@echo off
echo Starting Frontend and Backend servers...

:: Start backend (Spring Boot)
echo Starting backend...
start "Backend" cmd /k "cd backend\\fkult && mvnw spring-boot:run"

:: Start frontend (React + Vite)
echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers have been started.
pause
