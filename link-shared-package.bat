cd shared
call npm link
cd ..
start cmd /c "cd frontend && npm link shared"
start cmd /c "cd backend && npm link shared"
