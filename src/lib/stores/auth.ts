import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Um store Svelte para gerenciar o token de autenticação.
 * Ele sincroniza o token com o localStorage para persistir a sessão do usuário.
 */

// Inicializa o token a partir do localStorage se estivermos no navegador, caso contrário, nulo.
const initialToken = browser ? window.localStorage.getItem('authToken') : null;

export const authToken = writable<string | null>(initialToken);

// Sempre que o valor do token mudar, atualizamos o localStorage.
authToken.subscribe((token) => {
	if (browser) {
		if (token) {
			window.localStorage.setItem('authToken', token);
		} else {
			window.localStorage.removeItem('authToken');
		}
	}
});


