FROM node:22-alpine

ENV npm_config_update_notifier=false \
    npm_config_fund=false

WORKDIR /app

# Instala as dependências durante a construção da imagem. O entrypoint
# também executa npm ci ao iniciar o container para refletir alterações no
# package-lock.json mesmo usando o bind mount do código-fonte.
COPY package.json package-lock.json ./
RUN npm ci

COPY docker-entrypoint.sh ./
COPY . .

EXPOSE 5173

ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
