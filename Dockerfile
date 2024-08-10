# Используем Node.js как основу для сборки фронтенда
FROM node:20

EXPOSE 3000

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

#RUN chmod +x /app/node_modules/.bin/react-scripts

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы фронтенда
COPY . .

# Собираем фронтенд приложение

RUN npm run build

CMD ["npm", "run", "dev"]