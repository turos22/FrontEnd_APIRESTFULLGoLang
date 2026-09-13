'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PostProduct, PatchProduct, DeleteProduct } from '@/data/services/api';

export type EstadoErro = { erro: string } | null;

export async function SalvarProduto(
    estadoAnterior: EstadoErro,
    dados: FormData,
): Promise<EstadoErro> {
    const id = Number(dados.get('id') ?? 0);
    const nome = String(dados.get('nome') ?? '').trim();
    const descricao = String(dados.get('descricao') ?? '').trim();
    const precoEmReais = Number(String(dados.get('preco') ?? '').replace(',', '.'));
    const quantidade = Number(dados.get('quantidade') ?? 0);
    const imagemUrl = String(dados.get('imagemUrl') ?? '').trim();

    if (!nome) return { erro: 'Informe o nome do produto.' };
    if (!descricao) return { erro: 'Informe a descricao do produto.' };
    if (!Number.isFinite(precoEmReais) || precoEmReais <= 0) {
        return { erro: 'Preco precisa ser maior que zero.' };
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return { erro: 'Quantidade precisa ser inteiro maior que zero.' };
    }
    // Campo opcional: so valida a forma se algo foi digitado.
    if (imagemUrl && !/^https?:\/\//i.test(imagemUrl)) {
        return { erro: 'URL da imagem precisa comecar com http:// ou https://.' };
    }

    const produto = {
        id,
        nome,
        descricao,
        precoEmCentavos: Math.round(precoEmReais * 100),
        quantidade,
        imagemUrl: imagemUrl || null,
    };

    try {
        if (id > 0) await PatchProduct(produto);
        else await PostProduct(produto);
    } catch {
        return { erro: 'Nao foi possivel salvar o produto.' };
    }

    revalidatePath('/');
    revalidatePath('/painel');
    redirect('/painel');
}

export async function ExcluirProduto(dados: FormData): Promise<void> {
    const id = Number(dados.get('id') ?? 0);
    if (id <= 0) return;

    await DeleteProduct(id);

    revalidatePath('/');
    revalidatePath('/painel');
}
