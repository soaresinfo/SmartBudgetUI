// Importa a variável de ambiente do módulo virtual do SvelteKit
import { PUBLIC_API_PATH_URL } from '$env/static/public';
import { apiClient } from './apiClient';
// Define a "forma" (interface) de um objeto de transação para ter
// segurança de tipos e autocompletar no seu editor.
export interface Transaction {
	id_transaction: string;
	description: string;
	value: number;
	transaction_date: string; // A data virá como string no JSON
	type: 'INCOME' | 'EXPENSE';
	expense: {
		id_expense: string;
		planned_value:number;
        description:string;
	};
}
// Define o tipo para criar uma nova transação.
// Não inclui 'id_transaction' ou o objeto 'expense' aninhado,
// pois o backend cuidará disso.
export type NewTransaction = {
	id_transaction: string;
	description: string;
	value: number;
	transaction_date: string;
	type: 'INCOME' | 'EXPENSE';
	id_expense?: string; // Opcional, pois só se aplica a 'EXPENSE'
};
/**
 * Busca a lista de transações da API do backend.
 * @param startDate - A data de início no formato 'YYYY-MM-DD'.
 * @param endDate - A data de fim no formato 'YYYY-MM-DD'
 * @returns Uma promessa que resolve para um array de transações.
 */
export async function getTransactions(startDate: string, endDate: string): Promise<Transaction[]> {
	const data = await apiClient.get(`${PUBLIC_API_PATH_URL}/v1/transactions?startDate=${startDate}&endDate=${endDate}`);
	return data as Transaction[];

}

/**
 * Salva uma nova transação na API do backend.
 * @param transaction - O objeto da nova transação.
 */
export async function saveTransaction(transaction: NewTransaction): Promise<void> {
	await apiClient.post(`${PUBLIC_API_PATH_URL}/v1/transactions`, transaction);
}