import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">404 — pagina nao encontrada</h2>
      <p className="text-sm text-zinc-400">
        O endereco que voce abriu nao existe nesta loja.
      </p>
      <Link href="/" className="border rounded-full px-5 py-1 text-sm">
        Voltar para a loja
      </Link>
    </div>
  );
}
