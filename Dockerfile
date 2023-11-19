
# 构建生产环境镜像
FROM node:18-alpine AS base

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./prisma/schema.prisma .env.sample ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build
RUN cp .env.sample .env
RUN pnpm prisma generate
RUN pnpm run build:bundle


FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S dmc
RUN adduser -S nico -u 1001

RUN mkdir -p /app/logs
RUN mkdir -p /app/data
RUN chown -R nico:dmc /app/logs

# 拷贝文件
COPY --from=builder --chown=nico:dmc /app/bundle/schema.prisma ./
COPY --from=builder --chown=nico:dmc /app/bundle/index.js ./
COPY --from=builder --chown=nico:dmc /app/bundle/client/*.node ./


USER nico

EXPOSE 3000

CMD ["/bin/sh", "-c", "node ./index.js > /app/logs/start.log 2>&1"]