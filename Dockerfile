
# 构建生产环境镜像
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S dmc
RUN adduser -S nico -u 1001

RUN mkdir -p /app/logs
RUN mkdir -p /app/data
RUN chown -R nico:dmc /app/logs

# 拷贝文件
COPY --chown=nico:dmc /bundle/schema.prisma ./
COPY --chown=nico:dmc /bundle/index.js ./
COPY --chown=nico:dmc /bundle/client/*.node ./


USER nico

EXPOSE 3000

CMD ["/bin/sh", "-c", "node ./index.js > /app/logs/start.log 2>&1"]