# GitHub Actions -> GHCR -> Coolify Template

This folder is a reusable deployment template based on your current build method:

1. Push to `main`
2. GitHub Actions builds Docker image
3. Image is pushed to `ghcr.io`
4. GitHub Actions calls Coolify webhook
5. Coolify pulls latest image and redeploys

It is designed for:
- Next.js apps
- Payload + Next.js apps

## Folder Contents

- `template/.github/workflows/deploy-next-coolify.yml`
- `template/.github/workflows/deploy-payload-coolify.yml`
- `template/docker/Dockerfile.next`
- `template/docker/Dockerfile.payload-next`
- `template/docker-compose.mongo.yml`
- `template/env/.env.coolify.example`
- `template/docs/current-build-flow.md`

## How To Use In A New Project

## 1. Copy the right workflow and Dockerfile

For a plain Next.js app:
- Copy `template/.github/workflows/deploy-next-coolify.yml` to `.github/workflows/deploy.yml`
- Copy `template/docker/Dockerfile.next` to `Dockerfile`

For Payload + Next.js:
- Copy `template/.github/workflows/deploy-payload-coolify.yml` to `.github/workflows/deploy.yml`
- Copy `template/docker/Dockerfile.payload-next` to `Dockerfile`

Optional local DB for Payload development:
- Copy `template/docker-compose.mongo.yml` to `docker-compose.yml`

## 2. Ensure app is compatible with standalone runtime

For Next.js and Payload+Next.js:
- Set `output: 'standalone'` in `next.config.js` or `next.config.ts`
- Ensure build command outputs `.next/standalone`

## 3. Add required GitHub repository secrets

Go to: `Settings -> Secrets and variables -> Actions`

Required for all apps:
- `COOLIFY_WEBHOOK_URL`
- `COOLIFY_WEBHOOK_TOKEN`

Required for Payload workflow template:
- `PAYLOAD_SECRET`
- `MONGODB_URI`

If your app has additional build-time secrets, add them and pass them in workflow `build-args`.

## 4. Configure Coolify

Create a Coolify app/service that deploys from GHCR image.

Recommended setup:
- Image: `ghcr.io/<owner>/<repo>:latest`
- Exposed port: `3000`
- Health check path: `/` (or project specific)
- Runtime env vars: add values from `template/env/.env.coolify.example` as needed

If image is private:
- Configure GHCR credentials in Coolify with a token that can read packages.

## 5. Push to `main` to deploy

A successful run will:
- Build and push image tags:
  - `latest`
  - commit SHA
- Trigger Coolify webhook
- Start new deploy in Coolify

## Adapting For Different App Types

## Payload app notes

- Some Payload setups require build-time access to:
  - `PAYLOAD_SECRET`
  - `MONGODB_URI`
- Keep runtime secrets in Coolify as well.

## Next.js app notes

- Most projects do not need build args in CI.
- Runtime-only secrets should stay in Coolify env vars.

## Recommended Rollout Pattern

1. Keep auto deploy on `main`
2. Keep immutable SHA tags for rollback
3. In incidents, redeploy older SHA tag from Coolify

## Troubleshooting

Image builds but app crashes in Coolify:
- Check missing runtime env vars first.
- Confirm app listens on `0.0.0.0:3000` (or configured port).

Webhook step fails:
- Validate `COOLIFY_WEBHOOK_URL` and `COOLIFY_WEBHOOK_TOKEN`.

GHCR push denied:
- Ensure workflow permissions include `packages: write`.

Standalone files missing:
- Ensure `output: 'standalone'` is set.

## Notes

- This template is additive and does not alter your existing repo files.
- For a deeper explanation of your current pipeline, see:
  - `template/docs/current-build-flow.md`
