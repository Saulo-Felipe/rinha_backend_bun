FROM oven/bun
WORKDIR /app

COPY bun.lockb .
COPY package.json .

RUN bun install --frozen-lockfile --production

COPY . .

WORKDIR /app/src

CMD ["bun", "app.ts"]