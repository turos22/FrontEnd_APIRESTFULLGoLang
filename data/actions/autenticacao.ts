'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CadastrarUsuario, ErroDeApi, Logar, Logout } from '@/data/services/api';

export type EstadoErro = {erro : string} | null;

export async function Autenticar(estadoAnterior: EstadoErro, FormData: FormData): Promise<EstadoErro> {
    const email = FormData.get('email') as string;
    const senha = FormData.get('senha') as string;

    if (email && senha) {
        let token: string | null;
        try {
            token = await Logar(email, senha);
        }
        catch (erro) {
            return {erro : 'Erro ao tentar autenticar'};
        }

        if (!token) {
            return {erro : 'Usuário ou senha inválidos'};
        }

        const cookieStore = await cookies();
        cookieStore.set('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        redirect('/');
    }
    else{
        return {erro : 'Preencha todos os campos'};
    }
}
export async function Cadastrar(estadoAnterior: EstadoErro, FormData: FormData): Promise<EstadoErro> {
    const nome = FormData.get('nome') as string;
    const email = FormData.get('email') as string;
    const senha = FormData.get('senha') as string;
    const role = FormData.get('role') as string;

    if (nome && email && senha && role) {
        let token: string | null;
        try {
            token = await CadastrarUsuario({ id: 0, name: nome, email: email, password: senha, role: role, createdAt: null });
        }
        catch (erro) {
            return {erro : 'Erro ao tentar autenticar'};
        }

        if (!token) {
            return {erro : 'Usuário ou senha inválidos'};
        }

        const cookieStore = await cookies();
        cookieStore.set('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        redirect('/');
    }
    else{
        return {erro : 'Preencha todos os campos'}
    }
}

export async function Sair(): Promise<void> {
    // Logout() ja engole a propria falha — mesmo com a API fora do ar,
    // o cookie que o Next guarda para o navegador precisa sumir.
    await Logout();

    const cookieStore = await cookies();
    cookieStore.delete('jwt');
    redirect('/');
}