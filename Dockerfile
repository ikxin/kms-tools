FROM node:lts as builder

WORKDIR /app

COPY . .

RUN npm i -g bun \
  && bun install \
  && bun run db:init  \
  && bun run db:migrate \
  && bun run build \
  && bun build ./service/index.ts --compile --outfile kms-tools

FROM oven/bun:latest

COPY --from=builder /app/kms-tools /app/kms-tools
COPY --from=builder /app/sqlite.db /app/sqlite.db
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/service/binaries /app/service/binaries

WORKDIR /app

EXPOSE 3000 1688

CMD ["./kms-tools"]
