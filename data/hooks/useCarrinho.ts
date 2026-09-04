import { useContext } from "react";
import ContextoCarrinho from "@/data/contexts/ContextoCarrinho";

const useCarrinho = () => useContext(ContextoCarrinho);
export default useCarrinho;