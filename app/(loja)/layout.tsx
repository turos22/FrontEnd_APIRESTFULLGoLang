'use client';
import { ProvedorCarrinho } from "@/data/contexts/ContextoCarrinho";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ProvedorCarrinho>
      {props.children}
    </ProvedorCarrinho>
  );
}