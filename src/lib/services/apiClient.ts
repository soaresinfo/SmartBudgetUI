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
		// Token inválido ou expirado. Limpa o token e redireciona para o login.
		authToken.set(null);
		if (browser) {
			await goto('/login');
		}
		throw new Error('Sessão expirada. Por favor, faça o login novamente.');
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
	delete: (url: string) => request('DELETE', url)
};


