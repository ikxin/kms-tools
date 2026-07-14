FROM node:lts-slim AS app-builder

WORKDIR /app

COPY . .

RUN npm install --global corepack@latest && \
    corepack enable && \
    pnpm install --frozen-lockfile && \
    NITRO_PRESET=node-server pnpm build

FROM node:lts-slim

WORKDIR /app

COPY --from=app-builder /app/.output /app/.output

VOLUME ["/app/.data"]

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
