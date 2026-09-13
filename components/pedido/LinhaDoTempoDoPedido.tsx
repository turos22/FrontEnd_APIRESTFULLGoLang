'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ETAPAS_DO_PEDIDO, EtapaDoPedido, StatusPedido, STATUS_FALHOU } from '@/data/models/StatusPedido';

const ETAPA_FINAL: EtapaDoPedido = 'enviado';

const ROTULOS: Record<EtapaDoPedido, string> = {
    pendente: 'Pedido recebido',
    pago: 'Pagamento aprovado',
    separando: 'Separando no estoque',
    enviado: 'A caminho',
};

export default function LinhaDoTempoDoPedido({ status }: { status: StatusPedido }) {
    const roteador = useRouter();
    const [verificando, iniciarVerificacao] = useTransition();

    const falhou = status === STATUS_FALHOU;
    const acompanhando = !falhou && status !==  'enviado';

    useEffect(() => {
        if (!acompanhando) return;

        const intervalo = setInterval(() => {
            iniciarVerificacao(() => roteador.refresh());
        }, 3000);

        return () => clearInterval(intervalo);
    }, [acompanhando, roteador, iniciarVerificacao]);

    if (falhou) {
        return (
            <section aria-label="Status do pedido" className="flex flex-col gap-4 bg-zinc-900 rounded-2xl p-8">
                <header className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Acompanhamento</h2>
                    <span className="flex items-center gap-2 text-xs text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        pagamento recusado
                    </span>
                </header>
                <p className="text-sm text-zinc-400">
                    Nao foi possivel confirmar o pagamento apos varias tentativas. O pedido nao sera processado.
                </p>
            </section>
        );
    }

    const indiceAtual = ETAPAS_DO_PEDIDO.indexOf(status as EtapaDoPedido);
    const progresso = (indiceAtual / (ETAPAS_DO_PEDIDO.length - 1)) * 100;

    return (
        <section aria-label="Status do pedido" className="flex flex-col gap-8 bg-zinc-900 rounded-2xl p-8">
            <header className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Acompanhamento</h2>
                <span
                    className={`flex items-center gap-2 text-xs ${
                        acompanhando ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            acompanhando
                                ? `bg-emerald-400 ${verificando ? 'animate-ping' : 'animate-pulse'}`
                                : 'bg-zinc-600'
                        }`}
                    />
                    {acompanhando ? 'acompanhando' : 'concluido'}
                </span>
            </header>

            <div className="relative pt-2">
                <div className="absolute left-12 right-12 top-6 h-0.5 bg-zinc-800" aria-hidden />
                <div
                    className="absolute left-12 top-6 h-0.5 bg-emerald-400 transition-all duration-700 ease-out"
                    style={{ width: `calc((100% - 6rem) * ${progresso} / 100)` }}
                    aria-hidden
                />

                <ol className="relative flex justify-between">
                    {ETAPAS_DO_PEDIDO.map((etapa, indice) => {
                        const concluida = indice <= indiceAtual;
                        const atual = indice === indiceAtual;

                        return (
                            <li key={etapa} className="flex flex-col items-center gap-3 w-24 text-center">
                                <span
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors duration-500 ${
                                        concluida
                                            ? 'bg-emerald-400 border-emerald-400 text-zinc-900'
                                            : 'bg-zinc-900 border-zinc-700 text-zinc-600'
                                    } ${atual ? 'ring-4 ring-emerald-400/20' : ''}`}
                                >
                                    {indice + 1}
                                </span>
                                <span className={`text-xs leading-tight ${concluida ? 'text-zinc-100' : 'text-zinc-500'}`}>
                                    {ROTULOS[etapa]}
                                </span>
                            </li>
                        );
                    })}
                </ol>
            </div>

            <p aria-live="polite" className="sr-only">
                Status atual: {ROTULOS[status as EtapaDoPedido]}
            </p>
        </section>
    );
}
