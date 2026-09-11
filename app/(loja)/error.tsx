'use client'; // Error boundary precisa ser Client Component.

import { useEffect } from "react";

export default function Erro({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">Nao foi possivel carregar a loja</h2>
      <p className="max-w-md text-sm text-zinc-400">
        A API nao respondeu. Confira se ela esta no ar e tente de novo.
        {error.digest ? ` (ref: ${error.digest})` : null}
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="border rounded-full px-5 py-1 text-sm"
      >
        Tentar de novo
      </button>
    </div>
  );
}
