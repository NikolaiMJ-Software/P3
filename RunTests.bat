@echo off
REM Get the full path to the fkult backend folder
set BACKEND_DIR=%~dp0\backend\fkult

REM Open a new command window and run the backend tests
start cmd.exe /k "cd /d %BACKEND_DIR% && echo Running Spring Boot tests for %USERNAME%... && .\mvnw.cmd test"

REM Full path to the frontend folder (can be made relative if needed)
set FRONTEND_DIR=C:\Users\%USERNAME%\IdeaProjects\P3\frontend

REM Open a new command window and run the frontend tests
start cmd.exe /k "cd /d %FRONTEND_DIR% && echo Running frontend UI tests for %USERNAME%... && npm run test:ui"
