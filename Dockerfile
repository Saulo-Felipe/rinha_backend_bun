FROM oven/bun
WORKDIR /app

COPY . .

RUN bun build --target=bun /app/src/index.ts --outdir /app/build

CMD ["bun", "/app/build/index.js"]