cd shared
call npm unlink shared
cd ..
start cmd /c "cd frontend && npm unlink shared"
start cmd /c "cd backend && npm unlink shared"
