FROM oven/bun as basebunbuild
WORKDIR /app

COPY bun.lockb .
COPY package.json .

RUN bun install --frozen-lockfile

COPY src ./src

WORKDIR /app/src

CMD [ "bun", "app.ts" ]