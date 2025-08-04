<script lang="ts">
	import { onMount } from 'svelte';
	import type { Investment } from '$lib/services/investmentService';
	import { getInvestments } from '$lib/services/investmentService';

	let investmentsPromise: Promise<Investment[]> | null = null;
	let startDate: string;
	let endDate: string;

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
			console.log(`Buscando investimentos de ${startDate} a ${endDate}`);
			investmentsPromise = getInvestments(startDate, endDate);
		}
	}

	/**
	 * Função para agrupar uma lista de investimentos pela data.
	 * @param investments A lista plana de investimentos da API.
	 * @returns Um array de objetos, onde cada objeto contém uma data e uma lista de investimentos para essa data.
	 */
	function groupInvestmentsByDate(investments: Investment[]) {
		const grouped = investments.reduce((acc, investment) => {
			const date = investment.last_update_date;
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(investment);
			return acc;
		}, {} as Record<string, Investment[]>);

		// Converte o objeto para um array para facilitar a iteração no Svelte
		return Object.entries(grouped)
			.map(([date, investments]) => ({ date, investments }))
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordena do mais recente para o mais antigo
	}
</script>

<main class="container">
	<h1>Meus Investimentos</h1>

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
	
	{#if investmentsPromise}
		{#await investmentsPromise}
			<p class="loading-message">Carregando investimentos...</p>
		{:then investments}
			{@const groupedInvestments = groupInvestmentsByDate(investments)}
			<!-- Se houver mais de um investimento, mostra a tabela -->
			{#if groupedInvestments.length > 1}
				<div class="table-container">
					<table>
						<thead>
							<tr>
								<th>Data</th>
								<th>Tipo de Investimento</th>
								<th>Local</th>
								<th class="align-right">Saldo</th>
								<th class="align-right">Rendimento no Mês</th>
							</tr>
						</thead>
						<tbody>
							{#each investments as investment (investment.id_investment)}
								<tr>
									<td>
										{new Date(investment.last_update_date + 'T00:00:00').toLocaleDateString(
											'pt-BR'
										)}
									</td>
									<td>{investment.investment_type.description}</td>
									<td>{investment.location.description}</td>
									<td class="align-right">
										{new Intl.NumberFormat('pt-BR', {
											style: 'currency',
											currency: 'BRL'
										}).format(investment.balance)}
									</td>
									<td class="align-right revenue">
										{new Intl.NumberFormat('pt-BR', {
											style: 'currency',
											currency: 'BRL'
										}).format(investment.month_revenue)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<!-- Do contrário, mantém a visualização de cartões (para 0 ou 1 investimento) -->
				

				{#if groupedInvestments.length > 0}
					<!-- Loop externo para cada grupo de data -->
					{#each groupedInvestments as group (group.date)}
						<div class="date-group">
							<h2 class="date-group-header">
								{new Date(group.date + 'T00:00:00').toLocaleDateString('pt-BR', {
									day: '2-digit',
									month: 'long',
									year: 'numeric'
								})}
							</h2>

							<!-- Grid para as colunas de investimentos -->
							<div class="investments-grid">
								<!-- Loop interno para cada investimento dentro do grupo -->
								{#each group.investments as investment (investment.id_investment)}
									<div class="investment-card">
										<h3 class="card-title">{investment.investment_type.description}</h3>
										<p class="card-location">em {investment.location.description}</p>
										<p class="card-balance">
											{new Intl.NumberFormat('pt-BR', {
												style: 'currency',
												currency: 'BRL'
											}).format(investment.balance)}
										</p>
										<p class="card-revenue">
											Rendimento no mês:
											<span>
												{new Intl.NumberFormat('pt-BR', {
													style: 'currency',
													currency: 'BRL'
												}).format(investment.month_revenue)}
											</span>
										</p>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				{:else}
					<p>Nenhum investimento encontrado para o período selecionado.</p>
				{/if}
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
		max-width: 1200px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	h1 {
		color: #2c3e50;
		border-bottom: 2px solid #3498db;
		padding-bottom: 0.5rem;
		margin-bottom: 2rem;
	}

	.date-group {
		margin-bottom: 3rem;
	}

	.date-group-header {
		color: #34495e;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #ecf0f1;
	}

	/* Esta é a mágica para o layout em colunas responsivo */
	.investments-grid {
		display: grid;
		/* Cria colunas de no mínimo 280px e no máximo 1 fração do espaço.
		   O navegador preencherá o espaço com quantas colunas couberem. */
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem; /* Espaçamento entre os cartões */
	}

	.investment-card {
		background-color: #ffffff;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
		display: flex;
		flex-direction: column;
	}

	.investment-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
	}

	.card-title {
		font-size: 1.2rem;
		color: #2980b9;
		margin: 0 0 0.25rem 0;
	}

	.card-location {
		font-size: 0.9rem;
		color: #7f8c8d;
		margin: 0 0 1rem 0;
	}

	.card-balance {
		font-size: 1.5rem;
		font-weight: bold;
		color: #2c3e50;
		margin: auto 0 0.5rem 0; /* Empurra para baixo */
	}

	.card-revenue {
		font-size: 0.9rem;
		color: #95a5a6;
	}

	.card-revenue span {
		color: #27ae60;
		font-weight: bold;
	}

	.loading-message,
	.error-box {
		text-align: center;
		padding: 2rem;
	}

	.error-box {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
		border-radius: 8px;
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
</style>
