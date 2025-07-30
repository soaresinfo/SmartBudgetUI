<script lang="ts">
	import { onMount } from 'svelte';
	import type { Investment } from '$lib/services/investmentService';
	import { getInvestments } from '$lib/services/investmentService';

	// A promise para buscar os dados, como antes.
	let investmentsPromise: Promise<Investment[]>;

	onMount(() => {
		const today = new Date().toISOString().split('T')[0];
		const startDate = '2023-01-01'; // Ajuste o período conforme necessário
		investmentsPromise = getInvestments(startDate, today);
	});

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

	{#if investmentsPromise}
		{#await investmentsPromise}
			<p class="loading-message">Carregando investimentos...</p>
		{:then investments}
			<!-- Agrupa os investimentos antes de renderizar -->
			{@const groupedInvestments = groupInvestmentsByDate(investments)}

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
</style>
