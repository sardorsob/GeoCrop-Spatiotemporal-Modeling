# Agents

This file defines how agents operate in this repo.

## Roles

### Orchestrator

- Coordinates tasks.
- Checks dependency graph.
- Assigns one task at a time to Builders.
- Prevents two Builders from editing the same file.
- Does not implement feature code.

### Builder

- Reads `CLAUDE.md`, `SCOPE.md`, `TASKS.md`, and `memory/*.md` before starting.
- Checks dependencies.
- Marks `pending -> in-progress`.
- Implements only files listed in the task.
- Stops and explains if extra files are required.
- Runs verification.
- Writes Builder handoff notes.
- Marks `in-progress -> in-review`.
- Never marks `done`.

### QA

- Reviews `in-review` tasks.
- Verifies acceptance criteria, tests, typecheck, lint, security, and scope.
- Marks `in-review -> done` only with evidence.
- Marks `in-review -> needs-fix` with exact fix notes.
- Updates memory after done.

## Statuses

Allowed statuses:

- `pending`
- `in-progress`
- `in-review`
- `needs-fix`
- `blocked`
- `done`
- `obsolete`

Legal transitions:

- `pending -> in-progress`
- `in-progress -> in-review`
- `in-progress -> blocked`
- `in-review -> done`
- `in-review -> needs-fix`
- `in-review -> blocked`
- `needs-fix -> in-progress`
- `blocked -> pending`
- `blocked -> in-progress`
- `pending -> obsolete`

## Verification Gates

Before `done`:

- typecheck passes
- lint passes or absence is documented
- relevant tests pass
- acceptance criteria are checked
- security scan is clean
- secrets are not committed
- manual smoke is recorded when needed

## Tool Guardrails

- Do not generate images or invoke image-generation tools for dashboard work.
- Do not use or request `gpt-image-2`; if visual concepts are needed, describe
  them in text or implement them directly in code.

## Commit Policy

Use task-based commits once tasks exist:

```text
feat(scope): TASK-001 implement feature
fix(scope): TASK-001 handle edge case
docs(handover): finalize handoff
```
