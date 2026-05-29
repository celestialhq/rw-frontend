# Remnawave Frontend Fork

This is an unofficial fork of [remnawave/frontend](https://github.com/remnawave/frontend).

The fork tracks upstream Remnawave and adds UI support for Cloudflare Access authentication implemented in [celestialhq/rw-backend](https://github.com/celestialhq/rw-backend).

## What Is Added

- Cloudflare Access settings section in the authentication settings UI
- Controls for:
  - enabling Cloudflare Access login
  - Cloudflare Access team domain
  - Cloudflare Access audience
  - optional email/domain allowlist
- Auth status parsing for Cloudflare Access availability
- Automatic Cloudflare Access login attempt on the login page when enabled
- Fork-friendly dev release workflow for publishing `remnawave-frontend.zip`

The frontend keeps password login and existing auth flows intact. Cloudflare Access is additive and only activates when enabled by backend settings.

## Release Artifact

The frontend is published as a ZIP artifact:

```text
remnawave-frontend.zip
```

Dev builds are published to:

```text
https://github.com/celestialhq/rw-frontend/releases/download/dev-build/remnawave-frontend.zip
```

Backend Docker builds consume this ZIP and embed it into the backend image.

## GitHub Actions Configuration

The dev release workflow supports push to `dev` and manual `workflow_dispatch`.

Crowdin upload is optional. It runs only when these secrets are configured:

```text
CROWDIN_PROJECT_ID
CROWDIN_API_TOKEN
```

Telegram notifications are optional. They run only when these secrets are configured:

```text
TELEGRAM_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_TOPIC_ID
```

Release uploads use the built-in `GITHUB_TOKEN`, so repository Actions must allow read and write permissions.

## Related Images

The backend fork publishes Docker images:

```text
ghcr.io/celestialhq/rw-backend:dev
ghcr.io/celestialhq/rw-backend:main
ghcr.io/celestialhq/rw-backend:<tag>
ghcr.io/celestialhq/rw-backend:2
ghcr.io/celestialhq/rw-backend:latest
```

Docker Hub images, when enabled:

```text
piuspp/rw-backend:dev
piuspp/rw-backend:main
piuspp/rw-backend:<tag>
piuspp/rw-backend:2
piuspp/rw-backend:latest
```

## Upstream

Original project documentation is available at [docs.rw](https://docs.rw/).

Upstream repository: [remnawave/frontend](https://github.com/remnawave/frontend)
