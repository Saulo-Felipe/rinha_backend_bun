FROM oven/bun
WORKDIR /app

COPY bun.lockb .
COPY package.json .

RUN bun install --frozen-lockfile

# RUN rm -rf /app/src/database/*

COPY . .

WORKDIR /app/src

CMD ["bun", "index.ts"]