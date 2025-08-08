import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const ssr = false; // Desabilitar SSR para simplificar o acesso ao localStorage

export const load: LayoutLoad = async ({ url }) => {
	// A verificação só faz sentido no navegador, onde temos o localStorage
	if (browser) {
		const token = localStorage.getItem('authToken');
		const isLoginPage = url.pathname === '/login';

		// Se não há token e o usuário não está na página de login, redirecione-o para lá.
		if (!token && !isLoginPage) {
			throw redirect(307, '/login');
		}

		// Se há um token e o usuário tenta acessar a página de login, redirecione-o para a página principal.
		if (token && isLoginPage) {
			throw redirect(307, '/transactions');
		}
	}

	return {}; // Permite que a página seja renderizada se nenhuma condição de redirecionamento for atendida.
};


