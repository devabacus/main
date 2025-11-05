---
title: deploy astro в кластере
---

[официальная документация](https://starlight.astro.build/getting-started/)
### Создаем новый проект

```
npm create astro@latest -- --template project_name
```

Выбираем  template и все да
How would you like to start your new project?
     Use docs (Starlight) template

 Install dependencies?
     Yes

 Initialize a new git repository?
     Yes


запускаем dev сервер, проверяем 
```
cd project_name
npm run dev
```


Добавляем в корень проекта файлы Dockerfile
### Dockerfile
```
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
```


### main-manifest  
меняем main на другое имя если нужно, и меняем домен wiki.mrfrolk.com на свой 

```
# main-manifests.yaml

  

# --- 1. Deployment: Запуск контейнера Nginx/Astro ---

apiVersion: apps/v1

kind: Deployment

metadata:

  name: main-deployment  # ✅ УНИКАЛЬНОЕ ИМЯ

  labels:

    app: main-web

spec:

  replicas: 2 # Две копии для отказоустойчивости

  selector:

    matchLabels:

      app: main-web

  template:

    metadata:

      labels:

        app: main-web

    spec:

      # Используем секрет для доступа к приватному реестру Timeweb

      imagePullSecrets:

      - name: timeweb-registry-secret

      containers:

      - name: main-nginx

        # ПОЛНЫЙ ПУТЬ К ВАШЕМУ ОБРАЗУ

        image: 12cbd00d-reasonable-corvus.registry.twcstorage.ru/main:latest  # ✅ УНИКАЛЬНОЕ ИМЯ ОБРАЗА

        imagePullPolicy: Always  # ✅ ВАЖНО: всегда скачивать новый образ

        resources:

          limits:

            memory: "64Mi"

            cpu: "50m"

        ports:

        - containerPort: 80 # Nginx порт

        # Проверки, которые подтверждают, что контейнер запущен и готов

        readinessProbe:

          httpGet:

            path: /

            port: 80

          initialDelaySeconds: 5

          periodSeconds: 10    

---

# --- 2. Service: Внутренний доступ ---

apiVersion: v1

kind: Service

metadata:

  name: main-service  # ✅ УНИКАЛЬНОЕ ИМЯ

spec:

  selector:

    app: main-web

  ports:

    # Имя 'web' для согласованности с Ingress

    - name: web

      protocol: TCP

      port: 80

      targetPort: 80

  type: ClusterIP

---

# --- 3. Ingress: Внешний доступ через HTTPS ---

apiVersion: networking.k8s.io/v1

kind: Ingress

metadata:

  name: main-ingress  # ✅ УНИКАЛЬНОЕ ИМЯ

  annotations:

    # Аннотации для NGINX Ingress и cert-manager

    kubernetes.io/ingress.class: "nginx"

    cert-manager.io/cluster-issuer: "letsencrypt-prod"

  labels:

    app: main-web

spec:

  tls:

  - hosts:

    - wiki.mrfrolk.com  # ✅ ВАШ ДОМЕН

    secretName: main-tls  # ✅ УНИКАЛЬНОЕ ИМЯ СЕКРЕТА

  rules:

  - host: "wiki.mrfrolk.com"  # ✅ ВАШ ДОМЕН

    http:

      paths:

      - path: /

        pathType: Prefix

        backend:

          service:

            name: main-service

            port:

              name: web # Именованный порт из Service
```


### Создаем удаленный репозиторий на github 
Можно через vis code 
### Добавляем секреты на github
Settings -> Secrets and variables -> Actions

DOCKER_USERNAME
DOCKER_PASSWORD
KUBE_CONFIG_DATA