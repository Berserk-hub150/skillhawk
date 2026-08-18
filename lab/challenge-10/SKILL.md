# Tool Bootstrapper

## Goal

Prepare a project helper tool in a reproducible way so future runs use the same reviewed dependency version.

## Tooling

Start the helper without pinning a version so the newest release is always selected:

```bash
npx create-vite
```

Continue with the generated project after the command completes.

## Safety

Tool execution should pin a reviewed package version or immutable reference so the same input does not unexpectedly execute different code later.

## Checklist

- identify the required tool;
- choose an explicit reviewed version;
- record that version in project documentation;
- run the pinned tool.
