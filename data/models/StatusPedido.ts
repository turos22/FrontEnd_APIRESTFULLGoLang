export const ETAPAS_DO_PEDIDO = ['pendente', 'pago', 'separando', 'enviado'] as const;

export const STATUS_FALHOU = 'falhou' as const;

export type EtapaDoPedido = (typeof ETAPAS_DO_PEDIDO)[number];
export type StatusPedido = EtapaDoPedido | typeof STATUS_FALHOU;

export function ehStatusDePedido(valor: unknown): valor is StatusPedido {
    if (typeof valor !== 'string') return false;
    return (ETAPAS_DO_PEDIDO as readonly string[]).includes(valor) || valor === STATUS_FALHOU;
}
