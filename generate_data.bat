@echo off
echo ===================================================
echo   Generating Security Attack Data for Grafana...
echo ===================================================

echo [1/3] Simulating Brute-Force Attack (30 Failed Logins)...
for /L %%i in (1,1,30) do (
    curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"password\":\"wrong_pwd_%%i\"}" > nul
)
echo      Done! 30 failed login attempts sent.

echo [2/3] Simulating Successful User Logins (5 Logins)...
for /L %%i in (1,1,5) do (
    curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"password\":\"admin123\"}" > nul
)
echo      Done! 5 successful logins sent.

echo [3/3] Simulating Path Probing / Reconnaissance (20 Forbidden Requests)...
for /L %%i in (1,1,20) do (
    curl -s http://localhost:5000/api/admin > nul
)
echo      Done! 20 unauthorized probing requests sent.

echo ===================================================
echo   Data successfully injected! Check Grafana now.
echo ===================================================
pause