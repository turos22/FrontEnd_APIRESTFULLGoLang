import Cabecalho from "./Cabecalho";

export interface PaginaProps {
    children: React.ReactNode;
    className?: string;
}
export default function Pagina (props: PaginaProps) {
    return (
     <div className="flex flex-col min-h-screen"> 
        <Cabecalho/>
        <main className={`
           flex-1 max-w-[1200px] w-full mx-auto px-4
           ${props.className || ''} py-10
        `}
        
        >{props.children}</main>
     </div>        
    )
}
