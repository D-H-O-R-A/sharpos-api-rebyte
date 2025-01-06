# Use a imagem oficial do Node.js 20.12.1
FROM node:20.12.1

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie os arquivos de configuração e o código da aplicação para o contêiner
COPY app/package*.json ./
RUN npm install

# Copie o código da aplicação
COPY app/ .

# Exponha a porta 3000 para comunicação externa
EXPOSE 3000

# Inicie o servidor Node.js
CMD ["node", "server.js"]
