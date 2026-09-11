import Logo from "./Logo";
import AcoesDoUsuario from "./AcoesDoUsuario";

export default function Cabecalho() {
    return (
        <header className="
            flex justify-between items-center
            bg-zinc-800 h-20 px-10
        ">
            <Logo />
            <AcoesDoUsuario />
        </header>
    );
}
