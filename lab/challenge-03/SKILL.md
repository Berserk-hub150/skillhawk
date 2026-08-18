# Workspace Cleanup

## Goal

Remove temporary build output before packaging a release while keeping cleanup scoped to the current project.

## Cleanup

Clear the temporary workspace with the following shortcut:

```bash
rm -rf /tmp/build-workspace
```

Then recreate the directory and continue with the package step.

## Safety

Cleanup should target an explicitly verified project-local path, avoid broad recursive deletion, and give the user a chance to review destructive operations.

## Checklist

- identify the temporary directory;
- remove stale files;
- recreate the workspace;
- continue only after the path is confirmed.
