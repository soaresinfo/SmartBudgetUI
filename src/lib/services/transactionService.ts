// Importa a variável de ambiente do módulo virtual do SvelteKit
import { PUBLIC_API_BASE_URL } from '$env/static/public';

// Define a "forma" (interface) de um objeto de transação para ter
// segurança de tipos e autocompletar no seu editor.
export interface Transaction {
	id_transaction: string;
	description: string;
	value: number;
	transaction_date: string; // A data virá como string no JSON 
	expense: {
		id_expense: string;
		planned_value:number;
        description:string;
	};
}

/**
 * Busca a lista de transações da API do backend.
 * @param startDate - A data de início no formato 'YYYY-MM-DD'
 * @param endDate - A data de fim no formato 'YYYY-MM-DD'
 * @returns Uma promessa que resolve para um array de transações.
 */
export async function getTransactions(transactionDate: string): Promise<Transaction[]> {
	// Constrói a URL completa para a chamada
	const apiUrl = `${PUBLIC_API_BASE_URL}/transactions?transactionDate=${transactionDate}`;

	// Log para depuração: verifique no console do navegador se a URL está correta
	console.log('Buscando transações da API:', apiUrl);

	const response = await fetch(apiUrl);

	if (!response.ok) {
		// Se a resposta não for bem-sucedida, lança um erro
		console.error('Falha na chamada à API de transações:', response.status, response.statusText);
		throw new Error('Não foi possível buscar as transações do servidor.');
	}

	// Converte a resposta para JSON e a retorna
	return await response.json();
}
