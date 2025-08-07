# --- Estágio 1: Build ---
# Usamos uma imagem Node.js completa para instalar dependências e construir o projeto.
FROM node:18-alpine AS build

# Declara um argumento que pode ser passado durante o build
ARG PUBLIC_API_BASE_URL
ARG PUBLIC_API_PATH_URL
# Define a variável de ambiente para os comandos RUN subsequentes
ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL
ENV PUBLIC_API_PATH_URL=$PUBLIC_API_PATH_URL

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package.json package-lock.json ./

# Instala TODAS as dependências, incluindo as de desenvolvimento
RUN npm install

# Copia o resto do código-fonte da aplicação
COPY . .

# Executa o script de build para gerar os arquivos de produção
RUN npm run build

# --- Estágio 2: Produção ---
# Começamos de uma imagem limpa para manter o tamanho final pequeno.
FROM node:18-alpine AS production

WORKDIR /app

# Copia os arquivos de manifesto novamente
COPY package.json package-lock.json ./

# Instala APENAS as dependências de produção
RUN npm install --omit=dev

# Copia os arquivos construídos do estágio 'build' para o estágio 'production'
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

# Expõe a porta em que a aplicação SvelteKit irá rodar (padrão do adapter-node é 3000)
EXPOSE 3000

# Define o comando para iniciar a aplicação quando o container for executado
# O servidor Node.js fica no diretório 'build'
CMD [ "node", "build/index.js" ]
