import CartaoProduto from "@/components/produto/CartaoProduto";
import Pagina from "@/components/template/Pagina";
import { listarProdutos } from "@/data/services/api";

export default async function Home() {
  const produtos = await listarProdutos();

  return (
    <Pagina>
      {produtos.length === 0 ? (
        <p className="text-center text-zinc-400">
          Nenhum produto disponivel no momento.
        </p>
      ) : (
        <div className="flex gap-5 justify-center flex-wrap">
          {produtos.map((produto) => (
            <CartaoProduto key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </Pagina>
  );
}
