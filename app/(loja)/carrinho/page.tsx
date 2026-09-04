'use client'
import AreaItemCarrinho from "@/components/carrinho/AreaItemCarrinho";
import Pagina from "@/components/template/Pagina";
import useCarrinho from "@/data/hooks/useCarrinho";
import CarrinhoVazio from "@/components/carrinho/CarrinhoVazio";
export default function PaginaCarrinho(){
    const {itens, adicionar, remover} = useCarrinho();
    return (
        <Pagina className="flex flex-col items-center gap-5">
            {itens.length === 0?(
                <CarrinhoVazio/>
            ): <div className="flex flex-col gap-5">
                {itens.map(items => (
                    <AreaItemCarrinho key={items.produto.id} item={items} 
                    adicionar={(item) => adicionar(item.produto)} 
                    remover={(item) => remover(item.produto)} />
                ))}
            </div>}        
        </Pagina>
    )
}