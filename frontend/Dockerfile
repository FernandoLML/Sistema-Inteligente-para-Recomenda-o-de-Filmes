FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Web com Nginx
FROM nginx:alpine
# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copia nossa configuração personalizada para a porta 3000 e proxy
COPY nginx.conf /etc/nginx/conf.d/
# Copia os arquivos compilados do Vite do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
