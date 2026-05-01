# forge-notify

Multi-channel delivery with retries, batching, and audit trails.

> A Forge framework. **Live preview**: https://cdn.jsdelivr.net/gh/seeron6/forge-notify@main/preview/index.html

## What it is

A drop-in notification system with channel adapters (email, Slack, SMS, in-app), template rendering, retry queues, and delivery receipts. Built to be torn apart and rebuilt — every adapter is replaceable.

## Features

- **Channel adapters** — Email, Slack, SMS, push, in-app
- **Template engine** — MJML + Handlebars with preview
- **Retry queue** — Exponential backoff, dead-letter inspection
- **Audit log** — Per-recipient delivery receipts

## Stack

`nextjs`, `typescript`, `postgres`

## Layout

```
src/
└── index.ts          # Reference implementation
preview/
└── index.html        # Live preview surface (loaded by Forge sandbox)
forge.config.json     # Registry manifest (stripped at fork time)
forge.schema.json     # Config schema — drives the dashboard UI
```

## Forking

This repo is a GitHub template. Fork it through the Forge dashboard or directly via:

```
gh repo create your-org/your-notify --template seeron6/forge-notify --public
```

When you fork through Forge, the registry records the diff and links your fork
to the variant tree.

---

Forge is a living framework registry — every fork sharpens the next adoption.
Browse more at the registry: <https://github.com/seeron6/ForgeAI>.
