import { apiClient } from './apiClient';
import { authToken } from '$lib/stores/auth';
import { goto } from '$app/navigation';

interface AuthResponse {
	token: string;
}

export async function login(username: string, password: string): Promise<void> {
	const response: AuthResponse = await apiClient.post('/budget/api/v1/auth/token', { username, password });
	if (response && response.token) {
		authToken.set(response.token);
	} else {
		throw new Error('Resposta de autenticação inválida do servidor.');
	}
}

export function logout(): void {
	authToken.set(null);
	goto('/login');
}


