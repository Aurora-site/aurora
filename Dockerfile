FROM node:20-alpine AS frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /usr/src/app
COPY package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=bind,source=pnpm-lock.yaml,target=/usr/src/app/pnpm-lock.yaml \
    pnpm install --frozen-lockfile
COPY . .
ARG API_URL
RUN pnpm build

FROM caddy:2-alpine AS frontend-final
EXPOSE 8000
COPY --from=frontend /usr/src/app/deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=frontend /usr/src/app/dist /srv/dist
