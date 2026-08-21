# MASTER_CONTEXT

This file defines the **master context** for any PUB DEV LOOP project using this template. It outlines the high-level responsibilities that must be captured in version control to ensure full continuity.

- **Project identifier** – a clear, unique name for the project.
- **Repository URL** – the Git remote URL.
- **Primary branch** – typically `main`.
- **Checkpoint strategy** – when and how `devloop:checkpoint` should be invoked.
- **Resume strategy** – how `devloop:resume` reconstructs the state.
- **Ownership** – team or individual responsible for maintaining the context.

## Persistence-First Continuity

The repository is the durable source of truth for project evolution. A conversation, AI session, model, account, workstation, or local workspace must never be the only place where project-critical knowledge exists.

Every AI or developer using this template must, when repository write access is available:

1. Read the project's current context before changing it.
2. Materialize meaningful evolution in Git, including code/tests and relevant architecture, decisions, requirements, contracts, security constraints, status, blockers, and handoff/resume information.
3. Validate the change.
4. Update the relevant context and handoff documentation.
5. Commit and push the change or open a pull request.
6. Verify that the state required for continuation is persisted.

A session is not considered complete merely because the code works locally or in an ephemeral worker. The next AI or developer must be able to continue from the repository without depending on the previous conversation.

If persistence is blocked by permissions or connectivity, record the blocker explicitly and leave the work recoverable. Never claim that an evolution has been persisted when it has not.

The template's project maintainer must ensure that the instantiated repository has a clear entry point covering architecture, current state, decisions, blockers, and next safe steps.
