import { PUBLIC_API_PATH_URL } from '$env/static/public';
import { apiClient } from './apiClient';

export interface ExpenseCategory {
	id_category: string;
	description: string;
	planned_value: number;
}

/**
 * Busca a lista de categorias de despesa da API.
 * @returns Uma promessa que resolve para um array de categorias de despesa.
 */
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
	const data = await apiClient.get(`${PUBLIC_API_PATH_URL}/v1/categories/main`);
	return data as ExpenseCategory[];
}

export async function getExpenseCategoriesByParentId(idParent: string): Promise<ExpenseCategory[]> {
	const data = await apiClient.get(`${PUBLIC_API_PATH_URL}/v1/categories?idParent=${idParent}`);
	return data as ExpenseCategory[];
}