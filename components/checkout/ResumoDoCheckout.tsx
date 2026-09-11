'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import useCarrinho from '@/data/hooks/useCarrinho';
import { CriarPedido } from '@/data/actions/pedidos';
import { formatarCentavos } from '@/data/utils/moeda';

export default function ResumoDoCheckout() {
    const { itens, limpar } = useCarrinho();
    const [erro, setErro] = useState<string | null>(null);
    const [enviando, iniciarEnvio] = useTransition();
    const roteador = useRouter();

    const total = itens.reduce(
        (soma, item) => soma + item.produto.precoEmCentavos * item.quantidade,
        0,
    );

    function finalizar() {
        setErro(null);
        iniciarEnvio(async () => {
            const resultado = await CriarPedido(
                itens.map((item) => ({
                    produtoId: item.produto.id,
                    quantidade: item.quantidade,
                })),
            );

            if ('erro' in resultado) {
                setErro(resultado.erro);
                return;
            }

            limpar();
            roteador.push(`/pedido/${resultado.pedidoId}`);
        });
    }

    if (itens.length === 0) {
        return <p className="text-zinc-400">Seu carrinho esta vazio.</p>;
    }

    return (
        <div className="flex flex-col gap-5 bg-zinc-900 rounded-xl p-6 w-full max-w-md">
            <ul className="flex flex-col gap-2 text-sm">
                {itens.map((item) => (
                    <li key={item.produto.id} className="flex justify-between">
                        <span className="text-zinc-400">
                            {item.quantidade}x {item.produto.nome}
                        </span>
                        <span>{formatarCentavos(item.produto.precoEmCentavos * item.quantidade)}</span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between border-t border-zinc-800 pt-4 font-bold">
                <span>Total</span>
                <span>{formatarCentavos(total)}</span>
            </div>

            {erro && <p role="alert" className="text-sm text-red-500">{erro}</p>}

            <button
                type="button"
                onClick={finalizar}
                disabled={enviando}
                className="bg-zinc-100 text-zinc-900 rounded-full py-2.5 text-sm font-bold hover:bg-white transition disabled:opacity-50"
            >
                {enviando ? 'Enviando pedido...' : 'Finalizar compra'}
            </button>
        </div>
    );
}
