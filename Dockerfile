FROM node:24-alpine AS front-builder
WORKDIR /app/front

ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

COPY front/package*.json ./
RUN npm ci
COPY front/ ./
RUN npm run build


FROM node:24-alpine AS back-builder
WORKDIR /app/back

COPY back/package*.json ./
RUN npm ci
COPY back/ ./
RUN npm run build


FROM node:24-alpine
WORKDIR /app/back

ENV NODE_ENV=production

COPY back/package*.json ./
RUN npm ci --omit=dev

COPY --from=front-builder /app/front/dist /app/front/dist
COPY --from=back-builder /app/back/dist ./dist
EXPOSE 8080

CMD ["node", "dist/app.js"]
