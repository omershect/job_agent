# backend/init_db.py
"""
Initialises the SQLite database for the Job-Search Agent.

Prerequisites (from your venv / global Python):
    pip install sqlite-vec
    # or: pip install vectorlite_py apsw
"""

from __future__ import annotations
import pathlib
import sqlite3
import sys

# --- Settings --------------------------------------------------------------
ROOT_DIR   = pathlib.Path(__file__).resolve().parents[1]      # project root
DB_PATH    = ROOT_DIR / "jobs.db"
SCHEMA_SQL = (ROOT_DIR / "backend" / "schema.sql").read_text(encoding="utf-8")

# --- Try to import whichever vector extension you picked -------------------
try:
    import sqlite_vec as veclib          # "sqlite-vec"
    LOADABLE = veclib.loadable_path()
except ModuleNotFoundError:
    try:
        import vectorlite_py as veclib   # "vectorlite"
        LOADABLE = veclib.loadable_path()
    except ModuleNotFoundError as err:
        sys.exit(
            "❌  Neither 'sqlite-vec' nor 'vectorlite_py' is installed.\n"
            "    Run one of:\n"
            "       pip install sqlite-vec\n"
            "       # or\n"
            "       pip install vectorlite_py apsw"
        )

# --- Initialise ------------------------------------------------------------
con = sqlite3.connect(DB_PATH)

# 1️⃣ allow shared libraries for this connection
con.enable_load_extension(True)

# 2️⃣ load vec0 virtual table
con.load_extension(LOADABLE)

# 3️⃣ lock it back down (good hygiene)
con.enable_load_extension(False)

# 4️⃣ create tables & index
con.executescript(SCHEMA_SQL)
con.close()

print(f"✓ Database initialised → {DB_PATH.resolve()}")
