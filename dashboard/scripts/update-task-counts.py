#!/usr/bin/env python3
"""Regenerate the TASKS.md build-progress table from task status lines."""

from __future__ import annotations

from pathlib import Path
import re


TASKS = Path("TASKS.md")
STATUSES = ["done", "in-review", "in-progress", "needs-fix", "blocked", "pending"]


def main() -> int:
    if not TASKS.exists():
        print("TASKS.md not found")
        return 1

    text = TASKS.read_text(encoding="utf-8")
    statuses = re.findall(r"^- Status:\s*([a-z-]+)\s*$", text, flags=re.MULTILINE)
    counts = {status: statuses.count(status) for status in STATUSES}
    total = len(statuses)

    table = (
        "| Total | Done | In review | In progress | Needs fix | Blocked | Pending |\n"
        "|-------|------|-----------|-------------|-----------|---------|---------|\n"
        f"| {total} | {counts['done']} | {counts['in-review']} | "
        f"{counts['in-progress']} | {counts['needs-fix']} | "
        f"{counts['blocked']} | {counts['pending']} |"
    )

    pattern = re.compile(
        r"\| Total \| Done \| In review \| In progress \| Needs fix \| Blocked \| Pending \|\n"
        r"\|-------\|------\|-----------\|-------------\|-----------\|---------\|---------\|\n"
        r"\| .*? \| .*? \| .*? \| .*? \| .*? \| .*? \| .*? \|",
        flags=re.DOTALL,
    )

    if not pattern.search(text):
        print("Build progress table not found")
        return 1

    TASKS.write_text(pattern.sub(table, text, count=1), encoding="utf-8")
    print(
        "Updated TASKS.md counts: "
        f"total={total} done={counts['done']} in-review={counts['in-review']} "
        f"in-progress={counts['in-progress']} needs-fix={counts['needs-fix']} "
        f"blocked={counts['blocked']} pending={counts['pending']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

