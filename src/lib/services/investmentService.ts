// Importa a variável de ambiente do módulo virtual do SvelteKit
import { PUBLIC_API_PATH_URL } from '$env/static/public';
import { apiClient } from './apiClient';
// Define um "contrato" para o objeto de investimento.
// Isso garante autocompletar e segurança de tipos no seu código.
export interface Investment {
	id_investment: string;
	balance: number;
	month_revenue: number;
	last_update_date: string; // A data virá como string no JSON
	investment_type: {
		id_investment_type: string;
		description: string;
	};
	location: {
		id_location: string;
		description: string;
	};
}

/**
 * Busca a lista de investimentos da API do backend.
 * @param startDate - A data de início no formato 'YYYY-MM-DD'
 * @param endDate - A data de fim no formato 'YYYY-MM-DD'
 * @returns Uma promessa que resolve para um array de investimentos.
 */
export async function getInvestments(startDate: string, endDate: string): Promise<Investment[]> {
	// Constrói a URL completa para a chamada
	const apiUrl = `${PUBLIC_API_PATH_URL}/v1/investments?startDate=${startDate}&endDate=${endDate}`;
	const data = await apiClient.get(apiUrl)
	return data as Investment[];
	// Log para depuração: verifique no console do navegador se a URL está correta
	console.log('Buscando dados da API:', apiUrl);

	const response = await fetch(apiUrl);

	if (!response.ok) {
		// Se a resposta não for bem-sucedida, lança um erro
		console.error('Falha na chamada à API:', response.status, response.statusText);
		throw new Error('Não foi possível buscar os investimentos do servidor.');
	}

	// Converte a resposta para JSON e a retorna
	return await response.json();
}
