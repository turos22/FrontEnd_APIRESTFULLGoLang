'use client';

import { useUsuario } from "@/data/contexts/ContextoUsuario";
import Usuario from "@/data/models/Usuario";

interface MeProps {
    usuario?: Usuario | null
}

export default function Me({ usuario: usuarioProp }: MeProps) {
    const usuarioContexto = useUsuario();
    const usuario = usuarioProp ?? usuarioContexto;

    if (!usuario) return null;

    const iniciais = usuario.name?.slice(0, 2).toUpperCase() ?? '';
   const criadoEm = usuario.createdAt
    ? new Date(usuario.createdAt).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })
    : null;

    const MAPA_DE_ROLE: Record<string, string> = {
        comprador: 'Comprador',
        vendedor: 'Vendedor',
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="flex flex-col items-center gap-4 bg-zinc-900 rounded-xl p-10 w-full max-w-sm">
                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-2xl font-bold">
                    {iniciais}
                </div>

                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-2xl font-bold">{usuario.name}</h1>
                    <span className="border rounded-full px-4 py-0.5 text-xs text-zinc-400">
                        {MAPA_DE_ROLE[usuario.role] ?? usuario.role}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1 mt-4 text-sm text-zinc-400">
                    <span>{usuario.email}</span>
                    <span>ID #{usuario.id}</span>
                    {criadoEm && <span>Perfil criado em {criadoEm}</span>}
                </div>
            </div>
        </div>
    );
}