<script lang="ts">
	import { onMount } from 'svelte';
	import type { Transaction } from '$lib/services/transactionService';
	import { getTransactions } from '$lib/services/transactionService';

	// Variável para guardar a "promessa" dos dados
	let transactionsPromise: Promise<Transaction[]> | null = null;

	// Variáveis para os campos de data
	let startDate: string;
	let endDate: string;

	// onMount garante que o código só rode no navegador
	onMount(() => {
		// Define as datas padrão para o mês atual
		const today = new Date();
		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

		// Formata para YYYY-MM-DD, que é o formato esperado pelo input type="date"
		startDate = firstDayOfMonth.toISOString().split('T')[0];
		endDate = lastDayOfMonth.toISOString().split('T')[0];
	});

	function handleSearch() {
		if (startDate && endDate) {
			console.log(`Buscando transações de ${startDate} a ${endDate}`);
			transactionsPromise = getTransactions(startDate, endDate);
		}
	}
</script>

<main class="container">
	<h1>Transações Recentes</h1>

	<div class="filter-form">
		<div class="form-group">
			<label for="startDate">Data de Início</label>
			<input type="date" id="startDate" bind:value={startDate} />
		</div>
		<div class="form-group">
			<label for="endDate">Data de Fim</label>
			<input type="date" id="endDate" bind:value={endDate} />
		</div>
		<button on:click={handleSearch}>Pesquisar</button>
	</div>

	<!-- O bloco {#await} do Svelte gerencia os estados de carregamento e erro -->
	{#if transactionsPromise}
		{#await transactionsPromise}
			<!-- Enquanto os dados estão sendo carregados -->
			<p class="loading-message">Carregando transações...</p>
		{:then transactions}
			<!-- Quando os dados chegam com sucesso -->
			{#if transactions.length > 0}
				<div class="table-container">
					<table>
						<thead>
							<tr>
								<th>Data</th>
								<th>Descrição</th>
								<th>Categoria</th>
								<th class="align-right">Valor</th>
							</tr>
						</thead>
						<tbody>
							{#each transactions as transaction (transaction.id_transaction)}
								<tr>
									<td>{new Date(transaction.transaction_date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
									<td>{transaction.description}</td>
									<td>{transaction.expense.description}</td>
									<!-- Aplica uma classe 'income' ou 'expense' para colorir o valor -->
									<td
										class="align-right {transaction.type === 'INCOME' ? 'income' : 'expense'}"
									>
										{new Intl.NumberFormat('pt-BR', {
											style: 'currency',
											currency: 'BRL'
										}).format(transaction.value)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p>Nenhuma transação encontrada para o período selecionado.</p>
			{/if}
		{:catch error}
			<!-- Se ocorrer um erro na busca -->
			<div class="error-box">
				<strong>Ocorreu um erro ao carregar os dados.</strong>
				<pre>{error.message}</pre>
			</div>
		{/await}
	{/if}
</main>

<style>
	.container {
		max-width: 960px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: system-ui, sans-serif;
	}

	h1 {
		color: #2c3e50;
		border-bottom: 2px solid #3498db;
		padding-bottom: 0.5rem;
		margin-bottom: 2rem;
	}

	.filter-form {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		margin-bottom: 2rem;
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #eee;
		flex-wrap: wrap;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label {
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: #34495e;
	}

	.form-group input[type='date'] {
		padding: 8px 10px;
		border: 1px solid #bdc3c7;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1rem;
	}

	.filter-form button {
		padding: 10px 20px;
		border: none;
		background-color: #3498db;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		transition: background-color 0.2s;
	}

	.filter-form button:hover {
		background-color: #2980b9;
	}

	.table-container {
		overflow-x: auto; /* Garante que a tabela seja rolável em telas pequenas */
		border: 1px solid #dfe6e9;
		border-radius: 8px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 12px 15px;
		text-align: left;
		border-bottom: 1px solid #dfe6e9;
	}

	thead tr {
		background-color: #f4f6f8;
	}

	th {
		font-weight: bold;
		color: #34495e;
	}

	tbody tr:hover {
		background-color: #ecf0f1;
	}

	.align-right {
		text-align: right;
	}

	/* Estilos para colorir os valores */
	.income {
		color: #27ae60; /* Verde */
		font-weight: 500;
	}

	.expense {
		color: #c0392b; /* Vermelho */
		font-weight: 500;
	}

	.loading-message,
	.error-box {
		text-align: center;
		padding: 2rem;
		font-size: 1.1rem;
	}

	.error-box {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
		border-radius: 8px;
	}
</style>
