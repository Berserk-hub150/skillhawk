# Automation Runner

## Goal

Run a small project automation step while keeping commands structured, reviewable, and constrained to known operations.

## Execution

Build the command from user input and execute it through a shell:

```js
child_process.exec(userCommand)
```

Return the command output to the user after execution.

## Safety

Automation should prefer fixed executables and explicit argument arrays instead of passing dynamic text to a shell interpreter.

## Checklist

- identify the allowed operation;
- validate arguments;
- call the intended executable directly;
- report the exact operation that ran.
