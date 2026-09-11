'use server'

import { PostOrder, ItemParaPedido } from '@/data/services/api';

export type ResultadoCheckout = { erro: string } | { pedidoId: number };

export async function CriarPedido(itens: ItemParaPedido[]): Promise<ResultadoCheckout> {
    if (itens.length === 0) return { erro: 'Carrinho vazio.' };

    try {
        const pedido = await PostOrder(itens);
        if (!pedido) return { erro: 'Sessao expirada. Entre novamente.' };
        return { pedidoId: pedido.id };
    } catch {
        return { erro: 'Nao foi possivel criar o pedido.' };
    }
}
