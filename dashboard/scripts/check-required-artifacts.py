#!/usr/bin/env python3
"""Check that the workflow artifact skeleton is present."""

from __future__ import annotations

from pathlib import Path


REQUIRED = [
    "PROJECT.md",
    "SCOPE.md",
    "TASKS.md",
    "AGENTS.md",
    "CLAUDE.md",
    "HANDOVER.md",
    "docs/intake.md",
    "memory/architecture.md",
    "memory/patterns.md",
    "memory/decisions.md",
    "memory/stack-guidance.md",
    "logs/Overview.md",
    "logs/Progress Log.md",
    "logs/Credentials redacted.md",
    "logs/Handoff Notes.md",
]


def main() -> int:
    missing = [path for path in REQUIRED if not Path(path).exists()]
    if missing:
        print("FAIL: missing required artifacts")
        for path in missing:
            print(f"- {path}")
        return 1
    print("PASS: all required workflow artifacts exist")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

