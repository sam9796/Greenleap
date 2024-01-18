FROM node:alpine
WORKDIR /my-app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]