import { createContext, ReactNode, useMemo, useState, useCallback } from 'react';
import  ItemCarrinho  from '@/data/models/ItemCarrinho';
import Produto from '@/data/models/Produtos';
interface ContextoCarrinhoProps {
  itens: ItemCarrinho[];
  quantidadeItens: number;
  adicionar: (item: Produto) => void;
  remover: (item: Produto) => void;
}

interface ProvedorCarrinhoProps {
  children: ReactNode;
}

const ContextoCarrinho = createContext<ContextoCarrinhoProps>({
  itens: [],
  quantidadeItens: 0,
  adicionar: () => {},
  remover: () => {}
});

export function ProvedorCarrinho({ children }: ProvedorCarrinhoProps) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const adicionar = useCallback((item: Produto)=>{
    const indice = itens.findIndex(i => i.produto.id === item.id);
    if (indice == -1) {
      const novoItem: ItemCarrinho = {
        produto: item,
        quantidade: 1
      };
      setItens([...itens, novoItem]);
    }else{
        const novosItens = [...itens];
        novosItens[indice].quantidade += 1;
        setItens(novosItens);
    }
  }, [itens]);

  const remover = useCallback((item: Produto) => {
    const novosItens = itens.map(i => {
        if (i.produto.id === item.id) {
            i.quantidade -= 1;
        }
        return i; 
    }).filter(i => i.quantidade > 0);
    setItens(novosItens);
  }, [itens]);

  const valor = useMemo(() => ({
    itens,
    adicionar,
    remover,
    quantidadeItens: itens.reduce((total, item) => total + item.quantidade, 0)
  }), [itens, adicionar, remover]);

  return (
    <ContextoCarrinho.Provider value={valor}>
      {children}
    </ContextoCarrinho.Provider>
  );
}

export default ContextoCarrinho;