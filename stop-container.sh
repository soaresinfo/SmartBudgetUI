echo -e "********* Parando container smartbudget-ui-container"
docker stop smartbudget-ui-container

echo -e "\n********* Removendo arquivos para novo deploy"
docker rm smartbudget-ui-container
echo -e "\n********* Container finalizado."
