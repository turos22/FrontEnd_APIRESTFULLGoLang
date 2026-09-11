import Link from "next/link";
import Produto from "@/data/models/Produtos";
import { formatarCentavos } from "@/data/utils/moeda";
import { ExcluirProduto } from "@/data/actions/produtos";

export default function TabelaProdutos({ produtos }: { produtos: Produto[] }) {
    if (produtos.length === 0) {
        return <p className="text-zinc-400">Nenhum produto cadastrado ainda.</p>;
    }

    return (
        <table className="w-full text-sm">
            <thead className="text-left text-zinc-400">
                <tr>
                    <th className="py-2">Nome</th>
                    <th className="py-2">Preco</th>
                    <th className="py-2">Estoque</th>
                    <th className="py-2">Acoes</th>
                </tr>
            </thead>
            <tbody>
                {produtos.map((produto) => (
                    <tr key={produto.id} className="border-t border-zinc-800">
                        <td className="py-2">{produto.nome}</td>
                        <td className="py-2">{formatarCentavos(produto.precoEmCentavos)}</td>
                        <td className="py-2">{produto.quantidade}</td>
                        <td className="py-2 flex gap-3">
                            <Link href={`/painel?editar=${produto.id}`} className="text-zinc-300 underline">
                                Editar
                            </Link>
                            <form action={ExcluirProduto}>
                                <input type="hidden" name="id" value={produto.id} />
                                <button type="submit" className="text-red-500">Excluir</button>
                            </form>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
