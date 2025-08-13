<script lang="ts">
	import { onMount } from 'svelte';
	import type { Transaction, NewTransaction } from '$lib/services/transactionService';
	import { getTransactions, saveTransaction } from '$lib/services/transactionService';
	import type { ExpenseCategory } from '$lib/services/expenseService';
	import { getExpenseCategories } from '$lib/services/expenseService';

	// Variável para guardar a "promessa" dos dados
	let transactionsPromise: Promise<Transaction[]> | null = null;

	// Variáveis para os campos de data
	let startDate: string;
	let endDate: string;

	let newTransaction: NewTransaction = {
		description: '',
		value: 0,
		transaction_date: new Date().toISOString().split('T')[0],
		type: 'EXPENSE',
		id_expense: undefined
	};
	let expenseCategories: ExpenseCategory[] = [];
	let isSaving = false;
	let saveError: string | null = null;
	let showFormFields: boolean = false; // Controla a visibilidade dos campos do formulário

	onMount(async () => {
		// Define as datas padrão para o mês atual para a busca
		const today = new Date();
		const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

		// Formata para YYYY-MM-DD, que é o formato esperado pelo input type="date"
		startDate = firstDayOfMonth.toISOString().split('T')[0];
		endDate = lastDayOfMonth.toISOString().split('T')[0];

		// Busca a lista de transações e as categorias de despesa
		handleSearch();
		fetchCategories();
	});

	function handleSearch() {
		if (startDate && endDate) {
			console.log(`Buscando transações de ${startDate} a ${endDate}`);
			transactionsPromise = getTransactions(startDate, endDate);
		}
	}

	async function fetchCategories() {
		try {
			expenseCategories = await getExpenseCategories();
			if (expenseCategories.length > 0) {
				// Define uma categoria padrão se for uma despesa
				if (newTransaction.type === 'EXPENSE') {
					newTransaction.id_expense = expenseCategories[0].id_expense;
				}
			}
		} catch (error) {
			console.error('Erro ao buscar categorias:', error);
			// Opcional: mostrar um erro para o usuário
		}
	}

	function resetForm() {
		newTransaction = {
			description: '',
			value: 0,
			transaction_date: new Date().toISOString().split('T')[0],
			type: 'EXPENSE',
			id_expense: expenseCategories.length > 0 ? expenseCategories[0].id_expense : undefined
		};
		saveError = null;
	}

	async function handleSave() {
		isSaving = true;
		saveError = null;

		// Validação simples
		if (!newTransaction.description || newTransaction.value <= 0) {
			saveError = 'Descrição e valor (maior que zero) são obrigatórios.';
			isSaving = false;
			return;
		}

		try {
			// Garante que id_expense seja nulo se não for uma despesa
			const transactionToSave = {
				...newTransaction,
				id_expense: newTransaction.type === 'EXPENSE' ? newTransaction.id_expense : undefined
			};

			await saveTransaction(transactionToSave);
			resetForm();
			handleSearch(); // Recarrega a lista de transações
		} catch (error: any) {
			console.error('Erro ao salvar transação:', error);
			saveError = error.message || 'Ocorreu um erro desconhecido ao salvar.';
		} finally {
			isSaving = false;
		}
	}

	function toggleFormFields() {
		showFormFields = !showFormFields;
	}
</script>

<main class="container">
	<h1>Transações</h1>
	<div class="form-section">
		<h2>Adicionar Transação</h2>
		<button class="toggle-button" on:click={toggleFormFields}>
			{showFormFields ? 'Ocultar Campos' : 'Mostrar Campos'}
		</button>
		<form on:submit|preventDefault={handleSave} class="transaction-form">
			{#if showFormFields}
				<div class="form-grid">
					<div class="form-group">
						<label for="description">Descrição</label>
						<input type="text" id="description" bind:value={newTransaction.description} required />
					</div>
					<div class="form-group">
						<label for="value">Valor</label>
						<input type="number" id="value" step="0.01" bind:value={newTransaction.value} required />
					</div>
					<div class="form-group">
						<label for="transaction_date">Data</label>
						<input type="date" id="transaction_date" bind:value={newTransaction.transaction_date} required />
					</div>
					<div class="form-group">
						<label for="type">Tipo</label>
						<select id="type" bind:value={newTransaction.type}>
							<option value="EXPENSE">Despesa</option>
							<option value="INCOME">Receita</option>
						</select>
					</div>
					{#if newTransaction.type === 'EXPENSE'}
						<div class="form-group full-width">
							<label for="category">Categoria</label>
							<select id="category" bind:value={newTransaction.id_expense} required>
								{#each expenseCategories as category (category.id_expense)}
									<option value={category.id_expense}>{category.description}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>
				<button type="submit" disabled={isSaving}>
					{#if isSaving}Salvando...{:else}Salvar Transação{/if}
				</button>
				{#if saveError}
					<p class="error-message">{saveError}</p>
				{/if}
			{/if}
		</form>
	</div>
	<div class="form-section">
		<h2>Pesquisar Transação</h2>
		<div class="filter-form">
			<div class="form-grid">
				<div class="form-group">
					<label for="startDate">Data de Início</label>
					<input type="date" id="startDate" bind:value={startDate} />
				</div>
				<div class="form-group">
					<label for="endDate">Data de Fim</label>
					<input type="date" id="endDate" bind:value={endDate} />
				</div>
			</div>
			<button on:click={handleSearch}>Pesquisar</button>
		</div>
	</div>
	{#if transactionsPromise}
		{#await transactionsPromise}
			<p class="loading-message">Carregando transações...</p>
		{:then transactions}
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

	.form-section {
		padding: 1.5rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #eee;
		margin-bottom: 2rem;
	}

	.form-section h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: #34495e;
	}

	.transaction-form,
	.filter-form {
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #eee;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full-width {
		grid-column: span 2;
	}

	.form-group label {
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: #34495e;
	}

	.form-group input,
	.form-group select {
		padding: 8px 10px;
		border: 1px solid #bdc3c7;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1rem;
	}

	.transaction-form button,
	.filter-form button,
	.toggle-button {
		padding: 10px 20px;
		border: none;
		background-color: #3498db;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		transition: background-color 0.2s;
	}

	.transaction-form button,
	.toggle-button {
		grid-column: span 2;
	}

	.filter-form button {
		width: 100%;
		grid-column: span 2;
	}

	.transaction-form button:hover,
	.filter-form button:hover,
	.toggle-button:hover {
		background-color: #2980b9;
	}

	.table-container {
		overflow-x: auto;
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

	.income {
		color: #27ae60;
		font-weight: 500;
	}

	.expense {
		color: #c0392b;
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

	.error-message {
		color: #c0392b;
		font-weight: 500;
		margin-top: 0.5rem;
	}
</style>