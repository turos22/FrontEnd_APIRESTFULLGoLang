const formatador = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export function formatarCentavos(centavos: number): string {
    return formatador.format(centavos / 100);
}
