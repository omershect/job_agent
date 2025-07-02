"""Utility for importing jobs from ``Imported_Jobs.csv`` into ``jobs.db``.

This script provides a simple interactive menu:

1. Import any new rows from the CSV into the database.
2. Delete the existing database and re-import all rows from the CSV.
"""

from __future__ import annotations

import hashlib
import sqlite3
from pathlib import Path

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
DB_PATH = DATA_DIR / "jobs.db"
CSV_PATH = DATA_DIR / "Imported_Jobs.csv"
SCHEMA_PATH = ROOT_DIR / "backend" / "schema.sql"


def load_csv() -> pd.DataFrame:
    """Load and normalise the CSV file for import."""
    df = pd.read_csv(CSV_PATH)
    df.rename(columns={"link": "url", "date_applied": "posted"}, inplace=True)
    df["id"] = df.apply(
        lambda row: hashlib.sha256(
            f"{row['title']}|{row['company']}|{row['posted']}".encode()
        ).hexdigest(),
        axis=1,
    )
    df["location"] = ""
    df["jd"] = ""
    df["match_score"] = 0.0
    df["rationale"] = ""
    df["recommendation"] = ""
    cols = [
        "id",
        "title",
        "company",
        "location",
        "url",
        "posted",
        "jd",
        "match_score",
        "rationale",
        "recommendation",
    ]
    return df[cols]


def insert_rows(rows: pd.DataFrame) -> None:
    """Insert the provided rows into the jobs table."""
    with sqlite3.connect(DB_PATH) as conn:
        rows.to_sql("jobs", conn, if_exists="append", index=False)


def reinit_db() -> None:
    """Remove the existing database and recreate the schema."""
    if DB_PATH.exists():
        DB_PATH.unlink()
    with sqlite3.connect(DB_PATH) as conn:
        schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
        conn.executescript(schema_sql)


def import_new_rows(df: pd.DataFrame) -> None:
    """Import any rows from ``df`` that aren't already in the database."""
    with sqlite3.connect(DB_PATH) as conn:
        existing = {row[0] for row in conn.execute("SELECT id FROM jobs")}

    new_rows = df[~df["id"].isin(existing)]
    if new_rows.empty:
        print("✓ No new rows to import.")
        return

    insert_rows(new_rows)
    print(f"✓ Imported {len(new_rows)} new rows successfully.")


def full_import(df: pd.DataFrame) -> None:
    """Delete existing data and import all rows from CSV."""
    confirm = input(
        "WARNING: Database will be deleted and re-imported. Type 'yes' to continue: "
    )
    if confirm.lower() != "yes":
        print("Aborted.")
        return

    reinit_db()
    insert_rows(df)
    print(f"✓ Imported {len(df)} rows successfully.")


def main() -> None:
    df = load_csv()

    print("Select an option:")
    print("1. Import any new rows from Imported_Jobs.csv")
    print("2. Delete database and import all rows from scratch")

    choice = input("Enter 1 or 2: ").strip()
    if choice == "1":
        import_new_rows(df)
    elif choice == "2":
        full_import(df)
    else:
        print("Invalid choice.")


if __name__ == "__main__":
    main()