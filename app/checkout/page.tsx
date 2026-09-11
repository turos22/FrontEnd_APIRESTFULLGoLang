import Pagina from "@/components/template/Pagina";
import ResumoDoCheckout from "@/components/checkout/ResumoDoCheckout";
import { exigirUsuario } from "@/data/utils/sessao";

export default async function PaginaCheckout() {
    await exigirUsuario();

    return (
        <Pagina className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <ResumoDoCheckout />
        </Pagina>
    );
}
