# Current Build Flow (This Repository)

This document describes exactly how the existing CI/CD flow works in this repository.

## Trigger

Workflow file: `.github/workflows/docker-image.yml`

- Runs on `push` to `main`.
- No PR trigger by default.

## GitHub Actions Job Sequence

1. `actions/checkout@v4`
- Pulls repository code onto the runner.

2. `docker/setup-buildx-action@v3`
- Enables BuildKit/Buildx for faster and cacheable multi-stage Docker builds.

3. `docker/login-action@v3`
- Logs in to GitHub Container Registry (`ghcr.io`) using:
  - Username: `${{ github.actor }}`
  - Password: `${{ secrets.GITHUB_TOKEN }}`

4. Image name normalization
- Writes a lowercase image name to the environment:
  - `ghcr.io/${GITHUB_REPOSITORY,,}`
- Lowercase is required for GHCR compatibility.

5. `docker/build-push-action@v6`
- Builds Docker image from the repo root.
- Pushes tags:
  - `:latest`
  - `:${{ github.sha }}`
- Uses GitHub Actions cache (`type=gha`) for faster rebuilds.
- Passes build args from GitHub secrets:
  - `PAYLOAD_SECRET`
  - `MONGODB_URI`

6. Coolify deploy trigger
- If build/push succeeds, calls:
  - `${{ secrets.COOLIFY_WEBHOOK_URL }}`
- Auth header:
  - `Authorization: Bearer ${{ secrets.COOLIFY_WEBHOOK_TOKEN }}`

## Runtime Build Shape

Dockerfile: `Dockerfile`

- Multi-stage build:
  - `deps`: install dependencies
  - `builder`: run `pnpm build`
  - `runtime`: small production image
- Next.js standalone output is copied into runtime:
  - `.next/standalone`
  - `.next/static`
  - `public`
- Container starts with `node server.js` on port `3000`.

## Deployment Contract Between GitHub and Coolify

GitHub Actions is responsible for:
- Building image
- Pushing image tags to GHCR
- Notifying Coolify

Coolify is responsible for:
- Pulling the updated image
- Starting/restarting container with runtime environment variables
- Exposing app URL and health checks

## Required Secrets (Current Pattern)

In GitHub repository secrets:
- `COOLIFY_WEBHOOK_URL`
- `COOLIFY_WEBHOOK_TOKEN`
- `PAYLOAD_SECRET` (Payload builds)
- `MONGODB_URI` (Payload builds)

In Coolify app environment variables:
- Runtime vars your app needs (database URI, public URLs, auth secrets, etc.)

## Common Failure Modes

1. Image push fails
- Usually GHCR permissions issue.
- Confirm workflow permissions include `packages: write`.

2. Coolify webhook call fails
- Invalid URL/token, or token not accepted by Coolify.
- Confirm webhook endpoint and bearer token are from the target app/service.

3. App boot fails after deploy
- Often missing runtime env vars in Coolify.
- Distinguish build-time args (Docker build) from runtime env vars (container start).

4. Next standalone missing files
- Ensure `next.config.*` includes `output: 'standalone'`.
