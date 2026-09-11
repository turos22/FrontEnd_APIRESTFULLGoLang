import Autenticar from "@/components/auth/Autenticar";
import Me from "@/components/auth/me";
import Pagina from "@/components/template/Pagina";
import { Me as buscarUsuario } from "@/data/services/api"; // Alias para a função de API

export default async function MePage() {
    const usuario = await buscarUsuario();

    return (
        <Pagina>
            <Me usuario={usuario} />
        </Pagina>
    );
}