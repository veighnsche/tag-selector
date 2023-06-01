@echo off

REM Open a new window and execute npm run start in the frontend directory
start cmd /k "cd ./frontend && npm run start"

REM Open a new window and execute npm run dev in the backend directory
start cmd /k "cd ./backend && npm run dev"
