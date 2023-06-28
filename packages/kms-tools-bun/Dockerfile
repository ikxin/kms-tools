FROM ubuntu:latest as build

RUN apt update && apt install -y curl unzip && curl -fsSL https://bun.sh/install | bash

FROM ubuntu:latest

COPY --from=build /root/.bun/bin/bun /usr/local/bin
COPY . /root/web

# RUN cd /root/web && bun install

EXPOSE 8080

# WORKDIR /root/web

# CMD [ "bun", "run", "src/index.ts" ]

ENTRYPOINT [ "/root/web/entrypoint.sh" ]
