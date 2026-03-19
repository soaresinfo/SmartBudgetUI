// Importa a variável de ambiente do módulo virtual do SvelteKit
import { PUBLIC_API_PATH_URL } from '$env/static/public';
import { apiClient } from './apiClient';
// Define um "contrato" para o objeto de investimento.
// Isso garante autocompletar e segurança de tipos no seu código.
export interface InvestmentLocation {
	id_location: string;
	description: string;
}

export interface InvestmentType {
	id_investment_type: string;
	description: string;
}

export interface Investment {
	id_investment: string;
	id_portfolio: string;
	balance: number;
	month_revenue: number;
	contribution: number;
	last_update_date: string; // A data virá como string no JSON
	investment_type: InvestmentType;
	location: InvestmentLocation;
	withdraw: number;
}

export type NewInvestment = {
	id_investment: string;
	id_portfolio: string;
	balance: number;
	month_revenue: number;
	contribution: number;
	last_update_date: string;
	id_investment_type: string;
	id_location: string;
	withdraw: number;
};
/**
 * Busca a lista de investimentos da API do backend.
 * @param startDate - A data de início no formato 'YYYY-MM-DD'
 * @param endDate - A data de fim no formato 'YYYY-MM-DD'
 * @returns Uma promessa que resolve para um array de investimentos.
 */
export async function getInvestments(startDate: string, endDate: string): Promise<Investment[]> {
	// Constrói a URL completa para a chamada
	const data = await apiClient.get(
		`${PUBLIC_API_PATH_URL}/v1/investments?startDate=${startDate}&endDate=${endDate}`
	);
	return data as Investment[];
}

export async function saveInvestment(investment: NewInvestment): Promise<void> {
	await apiClient.post(`${PUBLIC_API_PATH_URL}/v1/investments`, investment);
}

export async function deleteInvestment(investment: NewInvestment): Promise<void> {
	await apiClient.delete(`${PUBLIC_API_PATH_URL}/v1/investments`, investment);
}

/**
 * Busca a lista de locations da API do backend.
 * @returns Uma promessa que resolve para um array de locations.
 */
export async function getLocations(): Promise<InvestmentLocation[]> {
	const data = await apiClient.get(`${PUBLIC_API_PATH_URL}/v1/locations`);
	return data as InvestmentLocation[];
}

/**
 * Busca a lista de tipos de investimento da API do backend.
 * @returns Uma promessa que resolve para um array de tipos de investimento.
 */
export async function getInvestmentTypes(): Promise<InvestmentType[]> {
	const data = await apiClient.get(`${PUBLIC_API_PATH_URL}/v1/investmentTypes`);
	return data as InvestmentType[];
}
