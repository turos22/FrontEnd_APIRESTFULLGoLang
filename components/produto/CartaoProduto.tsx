import Produto from "@/data/models/Produtos";
import Image from "next/image";
import useCarrinho from "@/data/hooks/useCarrinho";
export interface CartaoProdutoProps {
    produto: Produto;
}

export default function CartaoProduto (props: CartaoProdutoProps) {
    const {adicionar} = useCarrinho();
    const { nome, descricao, preco, imagem} = props.produto
    return (
        <div className="flex flex-col w-72 bg-zinc-900 rounded-xl">
            <div className=" relative w-72 h-52 rounded-t-xl overflow-hidden">
                <Image src={imagem} alt={nome} fill className="object-cover"/>
            </div>
            <div className="flex-1 flex flex-col gap-4 p-5 ">
                <h2 className="text-xl font-bold">{nome}</h2>
                <p className="flex-1 text-sm text-zinc-400">{descricao}</p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">R$ {preco.toFixed(2)}</span>
                    <button onClick={() => adicionar(props.produto)} className="border rounded-full px-5 py-1 text-sm">Adicionar</button>
                </div>
                
            </div>
        </div>
    )
}
        