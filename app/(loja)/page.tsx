'use client'
import Pagina from "@/components/template/Pagina";
import ContextoCarrinho from "@/data/contexts/ContextoCarrinho";
import Image from "next/image";
import useCarrinho from "@/data/hooks/useCarrinho";
import CartaoProduto from "@/components/produto/CartaoProduto";
import produtos from "@/data/constants/produtos";


export default function Home() {
  return (
    <Pagina>
      <div className="flex gap-5 justify-center flex-wrap">
        {produtos.map(produto => (
          <CartaoProduto key={produto.id} produto={produto} />
        ))}
      </div>
      
    </Pagina>
  );
}