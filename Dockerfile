# --- Этап 1: Сборка статики ---
# Используем Node.js для установки зависимостей и запуска сборки Astro
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
# Устанавливаем зависимости, исключая devDependencies, чтобы ускорить процесс
RUN npm install --omit=dev
COPY . .
# Запускаем сборку Astro, которая создает папку dist/
RUN npm run build 

# --- Этап 2: Запуск Nginx ---
# Используем легковесный образ Nginx
FROM nginx:stable-alpine
# Копируем только собранный статический контент из папки dist/
# в папку, которую Nginx использует для обслуживания статики (/usr/share/nginx/html)
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx по умолчанию слушает порт 80
EXPOSE 80
# Команда запуска Nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]