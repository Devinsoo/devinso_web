# syntax=docker/dockerfile:1
#
# devinso_web — the public Next.js 16 site. Two stages: a builder that installs
# dependencies and runs `next build`, and a slimmer runner that serves the
# compiled output with `next start`.

# ----------------------------------------------------------------- build ----
FROM node:22-alpine AS build
WORKDIR /app

# @playwright/test's postinstall would otherwise download ~100s of MB of
# browsers we never use in the image.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV NEXT_TELEMETRY_DISABLED=1

# Install against the lockfile first so this layer is cached until the
# manifests change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------- runtime ---
FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# `next start` honours PORT; the host port is mapped in docker-compose.
ENV PORT=3000

# Reuse the dependencies installed in the builder (they include `next`, which
# `next start` needs) rather than re-installing. Ship the build output and the
# config, not the source tree.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

# The site renders without the API, so a plain GET of the home page is a fair
# readiness probe.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["npm", "run", "start"]
