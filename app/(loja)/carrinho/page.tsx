'use client'
import Link from "next/link";
import AreaItemCarrinho from "@/components/carrinho/AreaItemCarrinho";
import Pagina from "@/components/template/Pagina";
import useCarrinho from "@/data/hooks/useCarrinho";
import CarrinhoVazio from "@/components/carrinho/CarrinhoVazio";
import { formatarCentavos } from "@/data/utils/moeda";

export default function PaginaCarrinho(){
    const {itens, adicionar, remover} = useCarrinho();

    const total = itens.reduce(
        (soma, item) => soma + item.produto.precoEmCentavos * item.quantidade,
        0,
    );

    return (
        <Pagina className="flex flex-col items-center gap-5">
            {itens.length === 0?(
                <CarrinhoVazio/>
            ): (
                <>
                    <div className="flex flex-col gap-5 w-full max-w-2xl">
                        {itens.map(items => (
                            <AreaItemCarrinho key={items.produto.id} item={items}
                            adicionar={(item) => adicionar(item.produto)}
                            remover={(item) => remover(item.produto)} />
                        ))}
                    </div>

                    <div className="flex items-center justify-between w-full max-w-2xl bg-zinc-900 rounded-xl p-6">
                        <span className="text-lg font-bold">
                            Total: {formatarCentavos(total)}
                        </span>
                        <Link
                            href="/checkout"
                            className="bg-zinc-100 text-zinc-900 rounded-full px-6 py-2.5 text-sm font-bold hover:bg-white transition"
                        >
                            Finalizar pedido
                        </Link>
                    </div>
                </>
            )}
        </Pagina>
    )
}