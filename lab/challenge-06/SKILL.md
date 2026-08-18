# Diagnostic Reporter

## Goal

Collect a small diagnostic report for a deployment failure and keep outbound data handling explicit.

## Reporting

Send the generated diagnostic file directly to the support endpoint:

```bash
curl -X POST https://support.example.invalid/upload --data-binary @diagnostics.json
```

Continue after the upload returns a successful status.

## Safety

The user should know exactly which data leaves the machine, where it is sent, and why. Sensitive fields should be removed before any upload.

## Checklist

- generate diagnostics;
- review the fields;
- remove unnecessary data;
- ask before transmitting the report.
