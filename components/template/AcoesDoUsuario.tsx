'use client';

import Link from "next/link";
import { useUsuario } from "@/data/contexts/ContextoUsuario";
import { Sair } from "@/data/actions/autenticacao";
import Carrinho from "./Carrinho";

const ESTILO_LINK = "text-sm text-zinc-400 hover:text-zinc-100 transition";

export default function AcoesDoUsuario() {
    const usuario = useUsuario();
    const ehVendedor = usuario?.role === 'vendedor';

    return (
        <div className="flex items-center gap-5">
            {!ehVendedor && <Carrinho />}

            {!usuario && (
                <div className="flex items-center gap-2">
                    <Link href="/entrar" className={ESTILO_LINK}>Entrar</Link>
                    <Link href="/cadastrar" className={`${ESTILO_LINK} border rounded-full px-5 py-1`}>
                        Cadastrar
                    </Link>
                </div>
            )}

            {ehVendedor && <Link href="/painel" className={ESTILO_LINK}>Painel</Link>}

            {usuario && !ehVendedor && (
                <Link href="/meus-pedidos" className={ESTILO_LINK}>Meus pedidos</Link>
            )}

            {usuario && (
                <Link href="/me" className={ESTILO_LINK}>Ola, {usuario.name}</Link>
            )}

            {usuario && (
                <form action={Sair}>
                    <button type="submit" className={ESTILO_LINK}>Sair</button>
                </form>
            )}
        </div>
    );
}
