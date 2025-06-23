@echo off
REM ----------------------------------------------------------
REM make_tree.bat  —  scaffolds the sub-folders & placeholder
REM                  files inside the *current* directory.
REM                  Run this *from inside* your job_agent dir.
REM ----------------------------------------------------------

REM ── backend folders ───────────────────────────────────────
md backend                     2>nul
md backend\scraping            2>nul
md backend\agents              2>nul

REM ── frontend folders ──────────────────────────────────────
md frontend\src\pages          2>nul
md frontend\src\components     2>nul

REM ── backend files ─────────────────────────────────────────
FOR %%F IN (app.py db.py schema.sql init_db.py scheduler.py) DO (
    if not exist "backend\%%F" type nul > "backend\%%F"
)

type nul > "backend\scraping\__init__.py"
type nul > "backend\scraping\base.py"
type nul > "backend\scraping\linkedin.py"

type nul > "backend\agents\crew_config.py"
type nul > "backend\agents\tasks.py"

REM ── frontend & misc files ─────────────────────────────────
type nul > "frontend\vite.config.ts"
type nul > "frontend\package.json"

type nul > ".env.example"
type nul > "requirements.txt"
type nul > "README.md"

echo.
echo ✓ Project scaffold created under: %CD%
echo   (All new files are empty placeholders.)
echo.
pause
