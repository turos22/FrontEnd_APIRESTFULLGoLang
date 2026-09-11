export default interface Produto {
    id: number;
    nome: string;
    descricao: string;
    precoEmCentavos: number;
    quantidade: number;
    imagemUrl: string | null;
}
