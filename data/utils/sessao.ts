import { redirect } from 'next/navigation';
import { Me } from '@/data/services/api';
import Usuario from '@/data/models/Usuario';

/**
 * Trava de rota para Server Components. Diferente de um middleware, que so
 * olharia a presenca do cookie, aqui a sessao e confirmada contra a API — um
 * jwt expirado nao passa.
 *
 * `redirect` tem retorno `never`, entao depois da chamada o TypeScript ja
 * sabe que `usuario` nao e nulo.
 */
export async function exigirUsuario(perfil?: Usuario['role']): Promise<Usuario> {
    const usuario = await Me();

    if (!usuario) redirect('/entrar');
    if (perfil && usuario.role !== perfil) redirect('/');

    return usuario;
}
