export const ETAPAS_DO_PEDIDO = ['pendente', 'pago', 'separando', 'enviado'] as const;

/**
 * O worker (cmd/worker/main.go) grava 'falhou' quando a cobranca e
 * recusada em todas as tentativas (~10% de chance por tentativa, ate 3).
 * Nao faz parte da esteira feliz — ETAPAS_DO_PEDIDO fica so com as 4 do
 * stepper — mas e um status real que a tela precisa reconhecer, senao o
 * polling nunca para num pedido que falhou de verdade.
 */
export const STATUS_FALHOU = 'falhou' as const;

export type EtapaDoPedido = (typeof ETAPAS_DO_PEDIDO)[number];
export type StatusPedido = EtapaDoPedido | typeof STATUS_FALHOU;

export function ehStatusDePedido(valor: unknown): valor is StatusPedido {
    if (typeof valor !== 'string') return false;
    return (ETAPAS_DO_PEDIDO as readonly string[]).includes(valor) || valor === STATUS_FALHOU;
}
