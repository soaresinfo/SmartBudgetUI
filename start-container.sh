PUBLIC_API_BASE_URL="http://192.168.12.107:8080" #remoto
#PUBLIC_API_BASE_URL="http://localhost:8080" #local
PUBLIC_API_PATH_URL="/budget/api"

echo -e "********* Parando container smartbudget-ui-container"
docker stop smartbudget-ui-container

echo -e "\n********* Removendo arquivos para novo deploy"
docker rm smartbudget-ui-container

echo -e "\n********* Iniciando build do projeto"
docker build --build-arg PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL --build-arg PUBLIC_API_PATH_URL=$PUBLIC_API_PATH_URL -t smartbudget-ui .

echo -e "\n********* Iniciando aplicação smartbudget-ui"
docker run -d -p 3000:3000 -e PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL -e PUBLIC_API_PATH_URL=$PUBLIC_API_PATH_URL --name smartbudget-ui-container smartbudget-ui
echo -e "\n********* Aplicação iniciada"
