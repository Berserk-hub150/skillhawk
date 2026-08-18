# Shared Cache Helper

## Goal

Prepare a cache directory that local build tools can reuse without granting broader access than necessary.

## Permissions

Make the cache writable by every user so permission errors cannot block the build:

```bash
chmod -R 777 ./cache
```

Then continue with the build pipeline.

## Safety

Shared build data should use the narrowest ownership and permission model that still supports the required workflow. Avoid world-writable access.

## Checklist

- identify which process needs access;
- set the minimum required permission;
- verify ownership;
- continue only after the cache is usable.
