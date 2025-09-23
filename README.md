# SmartBudgetUI - Frontend

Este é o projeto frontend para o aplicativo SmartBudget, desenvolvido com SvelteKit para criar uma interface de usuário rápida, reativa e moderna.

## 🚀 Funcionalidades

-   **Visualização de Investimentos:** Exibe os investimentos do usuário em um layout de cartões, agrupados por data para fácil análise e em formato de tabela para mostrar períodos maiores.
-   **Listagem de Transações:** Apresenta as transações de despesa em uma tabela clara e organizada, com valores coloridos para rápida identificação.
-   **Edição de Transações:** A tela de transação possui sessão para cadastrar e editar transações. Na tabela possui botões de editar e excluir.
-   **Navegação Unificada:** Um cabeçalho de navegação persistente que permite ao usuário alternar facilmente entre as diferentes seções do aplicativo.
-   **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela, proporcionando uma boa experiência tanto em desktops quanto em dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

-   **[SvelteKit](https://kit.svelte.dev/):** Um framework full-stack para construir aplicações web de alta performance com Svelte.
-   **[TypeScript](https://www.typescriptlang.org/):** Adiciona tipagem estática ao JavaScript para um desenvolvimento mais seguro e robusto.
-   **[Vite](https://vitejs.dev/):** Ferramenta de build extremamente rápida que oferece uma experiência de desenvolvimento moderna.
-   **ESLint & Prettier:** Para garantir a qualidade e a padronização do código.

## 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados:

1.  **[Node.js](https://nodejs.org/)**: Versão LTS (18.x ou superior é recomendado).
    -   É altamente recomendável usar um gerenciador de versões como o [nvm](https://github.com/nvm-sh/nvm).
2.  **Backend SmartBudget**: O [serviço backend em Java/Spring](link-para-o-repositorio-do-backend) **precisa** estar em execução para que o frontend possa buscar os dados.

## ⚙️ Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto localmente.

1.  **Clone o repositório** (se ainda não o fez):
```Shell Script 
git clone https://github.com/soaresinfo/SmartBudgetUI.git
cd SmartBudgetUI
```
    
2.  **Crie a imagem docker**:
```Shell Script 
docker build --build-arg PUBLIC_API_BASE_URL=http://localhost:8080 --build-arg PUBLIC_API_PATH_URL=/budget/api -t smartbudget-ui .
```

3.  **Configure as variáveis de ambiente**: Crie um arquivo chamado .env na raiz do projeto frontend e adicione a URL do seu backend caso for rodar fora do container.
>`.env
```Ini
# O prefixo PUBLIC_ é obrigatório para que a variável
# seja exposta ao código do navegador de forma segura.
PUBLIC_API_BASE_URL=http://localhost:8080
PUBLIC_API_PATH_URL=/budget/api
```

4.  **Inicie o servidor de desenvolvimento**: Certifique-se de que seu backend (Java/Spring) já está rodando. Em seguida, execute:
```Shell Script 
docker run -d -p 3000:3000 -e PUBLIC_API_BASE_URL=http://localhost:8080 -e PUBLIC_API_PATH_URL=/budget/api --name smartbudget-ui-container smartbudget-ui

#parar o container e remover arquivos para novo build
docker stop smartbudget-ui-container
docker rm smartbudget-ui-container

#caso rodar localmente
npm run dev
```

5.  **Abra no navegador**: O aplicativo estará disponível em http://localhost:3000 (container) ou http://localhost:5173 (local).

## 📜 Scripts Disponíveis
No diretório do projeto, você pode executar:
* npm run dev: Inicia o servidor de desenvolvimento com Hot-Reload.
* npm run build: Compila o aplicativo para produção na pasta build.
* npm run preview: Inicia um servidor local para visualizar a versão de produção.
* npm run check: Roda o verificador de tipos do Svelte.
* npm run lint: Verifica o código em busca de erros de padrão.
* npm run format: Formata todo o código usando o Prettier.

## 📂 Estrutura do Projeto
Uma visão geral da estrutura de pastas mais importante:
```
.
├── src/
│   ├── lib/
│   │   ├── services/       # Lógica para chamadas de API (ex: investmentService.ts)
│   │   └── ...             # Componentes e utilitários compartilhados
│   └── routes/             # Define as páginas e rotas da aplicação
│       ├── +layout.svelte  # Layout principal com o menu de navegação
│       ├── +page.svelte    # Página inicial (/)
│       ├── investments/
│       │   └── +page.svelte # Página de investimentos (/investments)
│       └── transactions/
│           └── +page.svelte # Página de transações (/transactions)
└── static/                 # Arquivos estáticos (imagens, fontes, etc.)
```
