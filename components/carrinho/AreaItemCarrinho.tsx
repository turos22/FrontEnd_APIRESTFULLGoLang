import { IconMinus, IconPlus, IconX } from "@tabler/icons-react";
import Image from "next/image";
import ItemCarrinho from "@/data/models/ItemCarrinho";
import { formatarCentavos } from "@/data/utils/moeda";

const IMAGEM_PADRAO = "/produto-sem-imagem.svg";

export interface ItemCarrinhoProps{
    item: ItemCarrinho
    adicionar: (item: ItemCarrinho) => void;
    remover: (item: ItemCarrinho) => void;
}

export default function AreaItemCarrinho(props: ItemCarrinhoProps) {
    const { produto, quantidade } = props.item;

    return (
        <div className="flex items-center gap-5 bg-zinc-900 rounded-md overflow-hidden">
            <div className="relative w-28 h-28">
                <Image
                    src={produto.imagemUrl ?? IMAGEM_PADRAO}
                    alt={produto.nome}
                    fill
                    sizes="112px"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col justify-center flex-1">
                <span className="text-xl font-bold">{produto.nome}</span>
                <span className="text-sm text-zinc-400">{produto.descricao}</span>
                <div className="flex items-center gap-2 mt-2 text-zinc-400 text-lg font-bold">
                    <span>{formatarCentavos(produto.precoEmCentavos)}</span>
                    <IconX size={20} stroke={1}/>
                    <span>{quantidade}</span>
                    <span>=</span>
                    <span className="text-yellow-500">
                        {formatarCentavos(produto.precoEmCentavos * quantidade)}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2 px-5">
                <button
                    type="button"
                    aria-label={`Remover uma unidade de ${produto.nome}`}
                    onClick={() => props.remover(props.item)}
                >
                    <IconMinus/>
                </button>
                <span className="flex px-4 py-2 rounded-md bg-black">
                    {quantidade}
                </span>
                <button
                    type="button"
                    aria-label={`Adicionar uma unidade de ${produto.nome}`}
                    onClick={() => props.adicionar(props.item)}
                >
                    <IconPlus/>
                </button>
            </div>
        </div>
    )
}
