<script lang="ts">
	import { onMount } from 'svelte';
	import type { Transaction } from '$lib/services/transactionService';
	import { getTransactions } from '$lib/services/transactionService';

	// Variável para guardar a "promessa" dos dados
	let transactionsPromise: Promise<Transaction[]>;

	// onMount garante que o código só rode no navegador
	onMount(() => {
		const today = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
		// Buscando transações do último ano como exemplo
		const lastYear = new Date();
		lastYear.setFullYear(lastYear.getFullYear() - 1);
		const startDate = '2025-07-28';
        console.log('Buscando transações...')
		// Inicia a busca pelos dados e armazena a promise
		transactionsPromise = getTransactions(startDate);
        
	});

    console.log('sasd');
</script>

<main class="container">
	<h1>Transações Recentes</h1>

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
