FROM alpine:latest AS vlmcsd-builder

WORKDIR /root

RUN apk add --no-cache git make build-base && \
    git clone --branch master --single-branch https://github.com/Wind4/vlmcsd.git && \
    cd vlmcsd/ && \
    make

FROM node:20-slim AS app-builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

RUN NITRO_PRESET=node-server pnpm run build

FROM node:20-slim

COPY --from=vlmcsd-builder /root/vlmcsd/bin/vlmcsd /usr/bin/vlmcsd
COPY --from=app-builder /app/.output /app/.output

RUN chmod +x /usr/bin/vlmcsd

WORKDIR /app

VOLUME ["/app/.data"]

EXPOSE 3000 1688

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["sh", "-c", "/usr/bin/vlmcsd -D -e & node .output/server/index.mjs"]
