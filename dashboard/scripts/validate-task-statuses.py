#!/usr/bin/env python3
"""Validate TASKS.md status values and progress-table counts."""

from __future__ import annotations

from pathlib import Path
import re
import sys


TASKS = Path("TASKS.md")
ALLOWED = {"pending", "in-progress", "in-review", "needs-fix", "blocked", "done", "obsolete"}
COUNTED = ["done", "in-review", "in-progress", "needs-fix", "blocked", "pending"]


def main() -> int:
    if not TASKS.exists():
        print("FAIL: TASKS.md not found")
        return 1

    text = TASKS.read_text(encoding="utf-8")
    task_ids = re.findall(r"^## (TASK-\d+)\s*$", text, flags=re.MULTILINE)
    statuses = re.findall(r"^- Status:\s*([a-z-]+)\s*$", text, flags=re.MULTILINE)

    ok = True
    if len(task_ids) != len(statuses):
        print(f"FAIL: task/status count mismatch: tasks={len(task_ids)} statuses={len(statuses)}")
        ok = False

    for status in statuses:
        if status not in ALLOWED:
            print(f"FAIL: invalid status {status}")
            ok = False

    table_match = re.search(
        r"\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|",
        text,
    )
    if not table_match:
        print("FAIL: progress count row not found")
        ok = False
    else:
        values = [int(value) for value in table_match.groups()]
        expected = [len(statuses)] + [statuses.count(status) for status in COUNTED]
        if values != expected:
            print(f"FAIL: progress table mismatch. table={values} expected={expected}")
            ok = False

    for required in ["- QA notes:", "- Attempts:", "- Max attempts:", "- Attempt log:"]:
        count = text.count(required)
        if count != len(task_ids):
            print(f"FAIL: {required} appears {count} times for {len(task_ids)} tasks")
            ok = False

    if ok:
        print("PASS: TASKS.md statuses and progress table are valid")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())

