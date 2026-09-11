'use client';

import { createContext, ReactNode, useCallback, useMemo, useSyncExternalStore } from 'react';
import ItemCarrinho from '@/data/models/ItemCarrinho';
import Produto from '@/data/models/Produtos';

const CHAVE_ARMAZENAMENTO = 'carrinho';
const CARRINHO_VAZIO: ItemCarrinho[] = [];

interface ContextoCarrinhoProps {
    itens: ItemCarrinho[];
    quantidadeItens: number;
    adicionar: (produto: Produto) => void;
    remover: (produto: Produto) => void;
    limpar: () => void;
}

interface ProvedorCarrinhoProps {
    children: ReactNode;
}

const ContextoCarrinho = createContext<ContextoCarrinhoProps>({
    itens: CARRINHO_VAZIO,
    quantidadeItens: 0,
    adicionar: () => {},
    remover: () => {},
    limpar: () => {},
});

/* ------------------------------------------------------------------ *
 * Store do carrinho, apoiado no localStorage.
 *
 * O estado nao mora em useState: o dono do dado e o localStorage, e o
 * componente apenas assina as mudancas com useSyncExternalStore. Assim a
 * leitura acontece depois da hidratacao (nunca no estado inicial, que
 * precisa bater com o HTML do servidor) sem setState dentro de efeito.
 * ------------------------------------------------------------------ */

function ehItemValido(valor: unknown): valor is ItemCarrinho {
    if (typeof valor !== 'object' || valor === null) return false;
    const item = valor as Partial<ItemCarrinho>;
    return (
        typeof item.quantidade === 'number' &&
        item.quantidade > 0 &&
        typeof item.produto?.id === 'number'
    );
}

function lerDoArmazenamento(): ItemCarrinho[] {
    try {
        const bruto = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
        if (!bruto) return CARRINHO_VAZIO;
        const dados: unknown = JSON.parse(bruto);
        return Array.isArray(dados) ? dados.filter(ehItemValido) : CARRINHO_VAZIO;
    } catch {
        return CARRINHO_VAZIO;
    }
}

let itensEmCache: ItemCarrinho[] | null = null;
const ouvintes = new Set<() => void>();

function notificar(): void {
    for (const ouvinte of ouvintes) ouvinte();
}

function inscrever(ouvinte: () => void): () => void {
    ouvintes.add(ouvinte);

    const aoMudarEmOutraAba = (evento: StorageEvent) => {
        if (evento.key !== null && evento.key !== CHAVE_ARMAZENAMENTO) return;
        itensEmCache = null;
        notificar();
    };
    window.addEventListener('storage', aoMudarEmOutraAba);

    return () => {
        ouvintes.delete(ouvinte);
        window.removeEventListener('storage', aoMudarEmOutraAba);
    };
}

function obterItens(): ItemCarrinho[] {
    if (itensEmCache === null) itensEmCache = lerDoArmazenamento();
    return itensEmCache;
}

function obterItensNoServidor(): ItemCarrinho[] {
    return CARRINHO_VAZIO;
}

function atualizarItens(transformar: (atuais: ItemCarrinho[]) => ItemCarrinho[]): void {
    const novos = transformar(obterItens());
    itensEmCache = novos;
    try {
        window.localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novos));
    } catch {
    }
    notificar();
}

export function ProvedorCarrinho({ children }: ProvedorCarrinhoProps) {
    const itens = useSyncExternalStore(inscrever, obterItens, obterItensNoServidor);

    const adicionar = useCallback((produto: Produto) => {
        atualizarItens((atuais) => {
            const jaEstaNoCarrinho = atuais.some((item) => item.produto.id === produto.id);
            if (!jaEstaNoCarrinho) return [...atuais, { produto, quantidade: 1 }];

            return atuais.map((item) =>
                item.produto.id === produto.id
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item,
            );
        });
    }, []);

    const remover = useCallback((produto: Produto) => {
        atualizarItens((atuais) =>
            atuais
                .map((item) =>
                    item.produto.id === produto.id
                        ? { ...item, quantidade: item.quantidade - 1 }
                        : item,
                )
                .filter((item) => item.quantidade > 0),
        );
    }, []);

    const limpar = useCallback(() => {
        atualizarItens(() => CARRINHO_VAZIO);
    }, []);

    const quantidadeItens = useMemo(
        () => itens.reduce((total, item) => total + item.quantidade, 0),
        [itens],
    );

    const valor = useMemo(
        () => ({ itens, quantidadeItens, adicionar, remover, limpar }),
        [itens, quantidadeItens, adicionar, remover, limpar],
    );

    return <ContextoCarrinho.Provider value={valor}>{children}</ContextoCarrinho.Provider>;
}

export default ContextoCarrinho;
