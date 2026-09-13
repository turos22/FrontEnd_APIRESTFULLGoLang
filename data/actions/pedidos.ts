'use server'

import { PostOrder, ItemParaPedido, ErroDeApi } from '@/data/services/api';

export type ResultadoCheckout = { erro: string } | { pedidoId: number };

export async function CriarPedido(itens: ItemParaPedido[]): Promise<ResultadoCheckout> {
    if (itens.length === 0) return { erro: 'Carrinho vazio.' };

    try {
        const pedido = await PostOrder(itens);
        if (!pedido) return { erro: 'Sessao expirada. Entre novamente.' };
        return { pedidoId: pedido.id };
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) {
            return { erro: 'Um dos produtos do carrinho nao existe mais. Remova-o e tente de novo.' };
        }
        return { erro: 'Nao foi possivel criar o pedido.' };
    }
}
