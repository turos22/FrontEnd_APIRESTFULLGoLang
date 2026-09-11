'use client';

import { useActionState } from 'react';
import { Autenticar, EstadoErro } from '@/data/actions/autenticacao';
import { IconAlertCircle } from '@tabler/icons-react';

const ESTADO_INICIAL: EstadoErro = null;

export default function FormularioEntrar() {
    const [estado, acaoAutenticar, pendente] = useActionState(Autenticar, ESTADO_INICIAL);

    return (
        <form action={acaoAutenticar} className="flex flex-col gap-5 w-full max-w-sm mx-auto bg-zinc-900 rounded-xl p-8">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="bg-black rounded-md px-4 py-2.5 text-sm outline-none border border-zinc-800 focus:border-zinc-500 transition"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="senha" className="text-sm text-zinc-400">Senha</label>
                <input
                    id="senha"
                    type="password"
                    name="senha"
                    required
                    className="bg-black rounded-md px-4 py-2.5 text-sm outline-none border border-zinc-800 focus:border-zinc-500 transition"
                />
            </div>

            {estado?.erro && (
                <p role="alert" className="flex items-center gap-2 text-sm text-red-500">
                    <IconAlertCircle size={18} stroke={1.5} />
                    {estado.erro}
                </p>
            )}

            <button
                type="submit"
                disabled={pendente}
                className="mt-2 bg-zinc-100 text-zinc-900 rounded-full py-2.5 text-sm font-bold hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {pendente ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    );
}