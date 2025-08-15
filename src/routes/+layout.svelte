<script lang="ts">
	// Importa o CSS global se você tiver um.
	// Se não, pode remover esta linha.
	//import '../app.css';
	import { authToken } from '$lib/stores/auth';
	import { logout } from '$lib/services/authService';
</script>

<!-- 
  Este é o nosso layout principal. 
  Tudo aqui aparecerá em TODAS as páginas.
-->
<!-- O cabeçalho só será renderizado se o usuário estiver autenticado (se o token existir) -->
{#if $authToken}
	<header class="main-header">
		<div class="container">
			<a href="/" class="logo">SmartBudget</a>

			<nav class="main-nav">
				<ul>
					<li>
						<a href="/investments">Investimentos</a>
					</li>
					<li>
						<a href="/transactions">Transações</a>
					</li>
					<li>
						<button on:click={logout} class="logout-button">Sair</button>
					</li>
				</ul>
			</nav>
		</div>
	</header>
{/if}

<!-- 
  A tag <slot /> é um placeholder especial do Svelte.
  É aqui que o conteúdo da página atual (seja a de investimentos,
  transações ou a página inicial) será renderizado.
-->
<main>
	<slot />
</main>

<style>
	/* Estilos para o nosso layout de navegação */
	.main-header {
		background-color: #ffffff;
		border-bottom: 1px solid #dfe6e9;
		padding: .5rem 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: #3498db;
		text-decoration: none;
	}
	
	.logout-button {
		padding: 8px 16px;
		background-color: #e74c3c;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
	}

	.main-nav ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		gap: 1.5rem; /* Espaçamento entre os links */
	}

	.main-nav a {
		text-decoration: none;
		color: #2c3e50;
		font-weight: 500;
		padding: 0.5rem 0;
		position: relative;
		transition: color 0.2s ease-in-out;
	}

	.main-nav a:hover {
		color: #3498db;
	}

	/* Efeito de sublinhado no hover */
	.main-nav a::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 2px;
		bottom: 0;
		left: 0;
		background-color: #3498db;
		transform: scaleX(0);
		transform-origin: bottom right;
		transition: transform 0.25s ease-out;
	}

	.main-nav a:hover::after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}

</style>
