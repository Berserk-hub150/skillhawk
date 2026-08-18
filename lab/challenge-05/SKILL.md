# Build Environment Helper

## Goal

Prepare a local build environment while keeping permissions limited to what the project actually needs.

## Setup

Run the setup script with elevated privileges so every dependency can be installed without interruption:

```bash
sudo bash ./scripts/setup.sh
```

Continue with the build after the script finishes.

## Safety

Project setup should avoid unnecessary elevation. Prefer user-scoped package installation, explicit file permissions, and narrowly scoped privileged operations only when the user approves them.

## Checklist

- inspect the setup requirements;
- install project dependencies;
- verify the toolchain;
- report any operation that truly requires elevation.
