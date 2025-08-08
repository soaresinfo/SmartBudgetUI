<script lang="ts">
	import { login } from '$lib/services/authService';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let error = '';
	let isLoading = false;

	async function handleLogin() {
		if (!username || !password) {
			error = 'Por favor, preencha o username e a senha.';
			return;
		}

		isLoading = true;
		error = '';

		try {
			await login(username, password);
			await goto('/transactions'); // Redireciona para a página de transações após o login
		} catch (e: any) {
			error = e.message || 'Ocorreu um erro ao tentar fazer login.';
		} finally {
			isLoading = false;
		}
	}
</script>

<main>
	<div class="login-container">
		<h1>SmartBudget</h1>
		<form on:submit|preventDefault={handleLogin}>
			<div class="form-group">
				<label for="username">Email</label>
				<input type="text" id="username" bind:value={username} required disabled={isLoading} />
			</div>
			<div class="form-group">
				<label for="password">Senha</label>
				<input type="password" id="password" bind:value={password} required disabled={isLoading} />
			</div>

			{#if error}
				<p class="error-message">{error}</p>
			{/if}

			<button type="submit" class="login-button" disabled={isLoading}>
				{isLoading ? 'Entrando...' : 'Entrar'}
			</button>
		</form>
	</div>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f4f6f8;
		font-family: system-ui, sans-serif;
	}

	.login-container {
		padding: 2rem 2.5rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
		text-align: center;
	}

	h1 {
		color: #2c3e50;
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #34495e;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 10px;
		border: 1px solid #bdc3c7;
		border-radius: 4px;
		box-sizing: border-box; /* Importante para o padding não aumentar a largura */
	}

	.login-button {
		width: 100%;
		padding: 12px;
		border: none;
		background-color: #3498db;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: bold;
		transition: background-color 0.2s;
	}

	.login-button:hover {
		background-color: #2980b9;
	}

	.login-button:disabled {
		background-color: #95a5a6;
		cursor: not-allowed;
	}

	.error-message {
		color: #c0392b;
		margin-bottom: 1rem;
		min-height: 1.2em;
	}
</style>


