import { notFound } from "next/navigation";
import Pagina from "@/components/template/Pagina";
import LinhaDoTempoDoPedido from "@/components/pedido/LinhaDoTempoDoPedido";
import { GetOrderById } from "@/data/services/api";
import { exigirUsuario } from "@/data/utils/sessao";

interface PaginaPedidoProps {
    params: Promise<{ id: string }>;
}

export default async function PaginaPedido({ params }: PaginaPedidoProps) {
    await exigirUsuario();

    const { id } = await params;
    const pedido = await GetOrderById(Number(id));

    if (!pedido) notFound();

    return (
        <Pagina className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold">Pedido #{pedido.id}</h1>

            <LinhaDoTempoDoPedido status={pedido.status} />

            <section className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">Itens</h2>
                <ul className="flex flex-col gap-2 text-sm text-zinc-400">
                    {pedido.orderItems.map((item) => (
                        <li key={item.produtoId} className="flex justify-between bg-zinc-900 rounded-lg px-4 py-3">
                            <span>Produto #{item.produtoId}</span>
                            <span>{item.quantidade}x</span>
                        </li>
                    ))}
                </ul>
            </section>
        </Pagina>
    );
}
