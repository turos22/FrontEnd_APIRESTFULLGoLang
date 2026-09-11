import CartaoProduto from "@/components/produto/CartaoProduto";
import Pagina from "@/components/template/Pagina";
import { listarProdutos } from "@/data/services/api";
import Cadastro from "@/components/auth/Cadastrar";


export default async function Home() {

  return (
    <Pagina>
      <Cadastro/>
    </Pagina>    
  );
}