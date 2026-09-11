import Pagina from "@/components/template/Pagina";
import TabelaProdutos from "@/components/painel/TabelaProdutos";
import FormularioProduto from "@/components/painel/FormularioProduto";
import { GetMeProducts } from "@/data/services/api";
import { exigirUsuario } from "@/data/utils/sessao";

interface PaginaPainelProps {
    searchParams: Promise<{ editar?: string }>;
}

export default async function PaginaPainel({ searchParams }: PaginaPainelProps) {
    await exigirUsuario('vendedor');

    const { editar } = await searchParams;
    const produtos = (await GetMeProducts()) ?? [];
    const produtoEmEdicao = editar
        ? produtos.find((produto) => produto.id === Number(editar)) ?? null
        : null;

    return (
        <Pagina className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold">Painel do vendedor</h1>
            <FormularioProduto produto={produtoEmEdicao} />
            <TabelaProdutos produtos={produtos} />
        </Pagina>
    );
}
