'use client';

import { useActionState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import Produto from '@/data/models/Produtos';
import { SalvarProduto, EstadoErro } from '@/data/actions/produtos';

const ESTADO_INICIAL: EstadoErro = null;
const ESTILO_CAMPO =
    'bg-black rounded-md px-4 py-2.5 text-sm outline-none border border-zinc-800 focus:border-zinc-500 transition';

export default function FormularioProduto({ produto }: { produto?: Produto | null }) {
    const [estado, acaoSalvar, pendente] = useActionState(SalvarProduto, ESTADO_INICIAL);

    return (
        <form
            key={produto?.id ?? 'novo'}
            action={acaoSalvar}
            className="flex flex-col gap-4 bg-zinc-900 rounded-xl p-6"
        >
            <h2 className="font-bold">{produto ? `Editando #${produto.id}` : 'Novo produto'}</h2>

            <input type="hidden" name="id" value={produto?.id ?? 0} />

            <label htmlFor="nome" className="text-sm text-zinc-400">Nome</label>
            <input id="nome" name="nome" required defaultValue={produto?.nome ?? ''} className={ESTILO_CAMPO} />

            <label htmlFor="descricao" className="text-sm text-zinc-400">Descricao</label>
            <input id="descricao" name="descricao" required defaultValue={produto?.descricao ?? ''} className={ESTILO_CAMPO} />

            <label htmlFor="preco" className="text-sm text-zinc-400">Preco em reais</label>
            <input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                min="0.01"
                required
                defaultValue={produto ? (produto.precoEmCentavos / 100).toFixed(2) : ''}
                className={ESTILO_CAMPO}
            />

            <label htmlFor="quantidade" className="text-sm text-zinc-400">Quantidade</label>
            <input
                id="quantidade"
                name="quantidade"
                type="number"
                min="1"
                required
                defaultValue={produto?.quantidade ?? 1}
                className={ESTILO_CAMPO}
            />

            {estado?.erro && (
                <p role="alert" className="flex items-center gap-2 text-sm text-red-500">
                    <IconAlertCircle size={18} stroke={1.5} />
                    {estado.erro}
                </p>
            )}

            <button
                type="submit"
                disabled={pendente}
                className="mt-2 bg-zinc-100 text-zinc-900 rounded-full py-2.5 text-sm font-bold hover:bg-white transition disabled:opacity-50"
            >
                {pendente ? 'Salvando...' : 'Salvar'}
            </button>
        </form>
    );
}
