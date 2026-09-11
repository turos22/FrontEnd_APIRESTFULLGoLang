export default function Carregando() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-yellow-500 animate-spin" />
      <span className="text-sm text-zinc-400">Carregando...</span>
    </div>
  );
}
