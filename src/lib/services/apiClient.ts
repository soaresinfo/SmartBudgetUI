import { get } from 'svelte/store';
import { authToken } from '$lib/stores/auth';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

async function request(method: string, url: string, data?: unknown) {
	const token = get(authToken);
	const headers: HeadersInit = {
		'Content-Type': 'application/json'
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const options: RequestInit = {
		method,
		headers
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	const response = await fetch(`${PUBLIC_API_BASE_URL}${url}`, options);

	if (response.status === 401) {
		// Token inválido/expirado (401).
		// Limpamos o token e forçamos um novo login.
		authToken.set(null);
		if (browser) {
			localStorage.removeItem('authToken');
		}
		if (browser) {
			await goto('/login');
		}
		throw new Error('Sessão expirada. Por favor, faça o login novamente.');
	}

	if (response.status === 403) {
		// Acesso negado (403).
		// Não redirecionamos para login, apenas lançamos o erro para ser tratado pela UI.
		throw new Error('Acesso negado. Você não tem permissão para acessar este recurso.');
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido na API' }));
		throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
	}

	return response.status === 204 ? null : response.json();
}

export const apiClient = {
	get: (url: string) => request('GET', url),
	post: (url: string, data: unknown) => request('POST', url, data),
	put: (url: string, data: unknown) => request('PUT', url, data),
	delete: (url: string, data: unknown) => request('DELETE', url, data)
};
