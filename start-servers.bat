@echo off
echo Setting up and starting CSCI3100 project...
echo.

:: Change to the script's directory
cd /d "%~dp0"

:: Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Setup Backend
echo.
echo Setting up backend...
cd backend


:: Install backend dependencies
echo Installing backend dependencies...
call npm install
call npm install dotenv express mongoose cors bcryptjs jsonwebtoken express-validator xml2js multer openai
call npm install nodemon --save-dev
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

:: Fix vulnerabilities
call npm audit fix --force

:: Start backend server
echo Starting backend server...
start cmd /k "npm run dev"
timeout /t 2

:: Setup Frontend
echo.
echo Setting up frontend...
cd ../frontend

:: Install frontend dependencies
echo Installing frontend dependencies...
call npm install
call npm install @mui/material @emotion/react @emotion/styled @mui/icons-material 
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
call npm audit fix --force

:: Start frontend server
echo Starting frontend server...
start cmd /k "npm run dev"
pause