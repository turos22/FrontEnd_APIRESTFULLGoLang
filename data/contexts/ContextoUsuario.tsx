'use client'

import { createContext, useContext } from "react";
import Usuario from "../models/Usuario";

const ContextoUsuario = createContext<Usuario | null>(null);

export function ProvedorUsuario({ usuario, children }: { usuario: Usuario | null, children: React.ReactNode }) {
    return <ContextoUsuario.Provider value={usuario}>{children}</ContextoUsuario.Provider>    
}

export function useUsuario() {
    return useContext(ContextoUsuario);
}