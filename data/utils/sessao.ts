import { redirect } from 'next/navigation';
import { Me } from '@/data/services/api';
import Usuario from '@/data/models/Usuario';

export async function exigirUsuario(perfil?: Usuario['role']): Promise<Usuario> {
    const usuario = await Me();

    if (!usuario) redirect('/entrar');
    if (perfil && usuario.role !== perfil) redirect('/');

    return usuario;
}
