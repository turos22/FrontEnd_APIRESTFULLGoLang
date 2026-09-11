import Link from "next/link";
import Pagina from "@/components/template/Pagina";
import { GetOrdersMe } from "@/data/services/api";
import { exigirUsuario } from "@/data/utils/sessao";

export default async function PaginaMeusPedidos() {
    await exigirUsuario();

    const pedidos = (await GetOrdersMe()) ?? [];

    return (
        <Pagina className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Meus pedidos</h1>

            {pedidos.length === 0 ? (
                <p className="text-zinc-400">Voce ainda nao fez nenhum pedido.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {pedidos.map((pedido) => (
                        <li key={pedido.id}>
                            <Link
                                href={`/pedido/${pedido.id}`}
                                className="flex justify-between bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition"
                            >
                                <span className="font-bold">Pedido #{pedido.id}</span>
                                <span className="text-sm text-zinc-400">
                                    {pedido.orderItems.length} item(ns)
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </Pagina>
    );
}
