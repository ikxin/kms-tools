FROM node:lts as builder

WORKDIR /app

COPY . .

RUN corepack enable \
  && pnpm install \
  && NITRO_PRESET=node-server pnpm run build

FROM node:lts

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/binaries /app/binaries

RUN chmod -R +x /app/binaries

WORKDIR /app

VOLUME ["/app/.data"]

EXPOSE 3000 1688

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
