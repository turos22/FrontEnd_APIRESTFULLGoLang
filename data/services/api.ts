import Produto from '@/data/models/Produtos';
import Usuario from '@/data/models/Usuario';
import Order from '../models/Order';
import { cookies } from 'next/headers';

const URL_BASE = process.env.API_URL ?? 'http://localhost:8080';

/**
 * Formato cru devolvido pela API Go — ver `internal/entidades/products/dto.go`.
 * `price` vem em centavos. `image_url` ainda nao e exposto pelo DTO da API;
 * o campo fica opcional para o front nao quebrar quando ele aparecer.
 */
interface ProdutoDaApi {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image_url?: string | null;
}

export class ErroDeApi extends Error {
    constructor(readonly status: number, mensagem: string) {
        super(mensagem);
        this.name = 'ErroDeApi';
    }
}

type RepostaAPI<T> = {
    success: boolean;
    data: T;
    response: Response;
};

function paraProduto(dto: ProdutoDaApi): Produto {
    return {
        id: dto.id,
        nome: dto.name,
        descricao: dto.description ?? '',
        precoEmCentavos: dto.price,
        quantidade: dto.quantity,
        imagemUrl: dto.image_url ?? null,
    };
}

/**
 * Espelha `produtoparams` de internal/entidades/products/types.go.
 *
 * `VerificarProdut` (products/handler.go:42) rejeita com 400 se faltar
 * description, price_in_cents, quantity OU category_id. Nao da para omitir
 * nenhum deles. `category_id` esta fixo em 1 porque a API nao expoe rota de
 * categorias — ver B5 em docs/superpowers/plans/2026-09-11-bloqueios-backend-go.md.
 *
 * `active: true` e obrigatorio: `ListProducts` filtra `WHERE active = true`.
 */
const CATEGORIA_PADRAO = 1;

function paraCorpoDeProduto(produto: Produto) {
    return {
        id: produto.id,
        name: produto.nome,
        description: produto.descricao,
        price_in_cents: produto.precoEmCentavos,
        quantity: produto.quantidade,
        category_id: CATEGORIA_PADRAO,
        image_url: produto.imagemUrl ?? '',
        active: true,
    };
}

interface ItemDePedidoDaApi {
    product_id: number;
    quantity: number;
}

interface PedidoDaApi {
    order_id: number;
    customer_id: number;
    items: ItemDePedidoDaApi[] | null;
}

function paraPedido(dto: PedidoDaApi): Order {
    return {
        id: dto.order_id,
        userId: dto.customer_id,
        orderItems: (dto.items ?? []).map((item) => ({
            produtoId: item.product_id,
            quantidade: item.quantity,
        })),
    };
}

async function requisitar<T>(caminho: string, init?: RequestInit): Promise<RepostaAPI<T>> {
    const metodo = init?.method ?? 'GET';
    let resposta: Response;

    try {
        resposta = await fetch(`${URL_BASE}${caminho}`, {
            ...init,
            headers: { Accept: 'application/json', ...init?.headers },
        });
    } catch {
        throw new ErroDeApi(0, `${metodo} ${caminho} nao alcancou a API em ${URL_BASE}`);
    }

    if (!resposta.ok) {
        throw new ErroDeApi(
            resposta.status,
            `${metodo} ${caminho} devolveu ${resposta.status}`,
        );
    }

    const semCorpo =
        resposta.status === 204 || resposta.headers.get('content-length') === '0';

    return {
        success: true,
        data: (semCorpo ? null : await resposta.json()) as T,
        response: resposta,
    };
}

async function pegarJWT(): Promise<string | null> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;
    if (!jwt) {
        return null;
    }

    return jwt;
}


export interface FiltroDeProdutos {
    nome?: string;
    categoriaId?: number;
    limite?: number;
    pagina?: number;
}

export async function listarProdutos(filtro: FiltroDeProdutos = {}): Promise<Produto[]> {
    const query = new URLSearchParams();
    if (filtro.nome) query.set('name', filtro.nome);
    if (filtro.categoriaId) query.set('categoriaid', String(filtro.categoriaId));
    if (filtro.limite) query.set('limit', String(filtro.limite));
    if (filtro.pagina) query.set('page', String(filtro.pagina));

    const parametros = query.toString();
    const caminho = parametros ? `/products?${parametros}` : '/products';

    const dtos = await requisitar<ProdutoDaApi[] | null>(caminho);
    return (dtos.data ?? []).map(paraProduto);
}

export async function buscarProdutoPorId(id: number): Promise<Produto | null> {
    try {
        return paraProduto((await requisitar<ProdutoDaApi>(`/product/${id}`)).data);
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

export async function Logar(email: string, senha: string): Promise<string | null> {
    try {
        const resposta = await requisitar<{ resposta: Response }>(`/auth/login`, {method :'POST',
            body: JSON.stringify({email: email, password: senha}), headers: {'Content-Type': 'application/json'}}
        );
        const cookies = resposta.response.headers.getSetCookie();
        if (cookies){
            const cookie = cookies.find((c) => c.startsWith('jwt='));
            if (cookie){
                return cookie.split(';')[0].split('=')[1];
            }
        }
        return null;
    }
    catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

export async function CadastrarUsuario(Usuario : Usuario): Promise<string | null> {
    try{
       const resposta = await requisitar<{ resposta: Response }>(`/auth/register`, {method :'POST',
            body: JSON.stringify({
                email: Usuario.email,
                name: Usuario.name,
                password: Usuario.password,
                role: Usuario.role
            }), headers: {'Content-Type': 'application/json'}});
        const cookies = resposta.response.headers.getSetCookie();

        if (cookies){
            const cookie = cookies.find((c) => c.startsWith('jwt='));
            if (cookie){
                return cookie.split(';')[0].split('=')[1];
            }
        }
        return null;
    }
    catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

// export async function Logout(): Promise<void> {
// //
// }

export async function Me(): Promise<Usuario | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;

    try {
        const resposta = await requisitar<Usuario>('/auth/me', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
        return resposta.data;
    }
    catch (erro) {
        if (erro instanceof ErroDeApi && (erro.status === 401 || erro.status === 404)) return null;
        throw erro;
    }
}

export interface ItemParaPedido {
    produtoId: number;
    quantidade: number;
}

export async function PostOrder(itens: ItemParaPedido[]): Promise<Order | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;
    try {
        const resposta = await requisitar<PedidoDaApi>('/orders', {
            method: 'POST',
            body: JSON.stringify({
                items: itens.map((item) => ({
                    product_id: item.produtoId,
                    quantity: item.quantidade,
                })),
            }),
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
        return paraPedido(resposta.data);
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

export async function GetOrderById(id: number): Promise<Order | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;
    try {
        const resposta = await requisitar<PedidoDaApi>(`/orders/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
        return paraPedido(resposta.data);
    } catch (erro) {
        if (erro instanceof ErroDeApi && (erro.status === 404 || erro.status === 403)) return null;
        throw erro;
    }
}

/** BLOQUEADA pelo item 2 da secao 2 — `/orders/me` devolve 400 sempre. */
export async function GetOrdersMe(): Promise<Order[] | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;
    try {
        const resposta = await requisitar<PedidoDaApi[] | null>('/orders/me', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
        return (resposta.data ?? []).map(paraPedido);
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

/** BLOQUEADA pelo item 1 da secao 2 — `/me/products` devolve 400 sempre. */
export async function GetMeProducts(): Promise<Produto[] | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;
    try {
        const resposta = await requisitar<ProdutoDaApi[] | null>('/me/products', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
        return (resposta.data ?? []).map(paraProduto);
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

export async function PostProduct(produto: Produto): Promise<Produto | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;
    try {
        const resposta = await requisitar<ProdutoDaApi>('/products', {
            method: 'POST',
            body: JSON.stringify(paraCorpoDeProduto(produto)),
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
        return paraProduto(resposta.data);
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

/** A rota nao tem {id}: o handler le o id do corpo. */
export async function PatchProduct(produto: Produto): Promise<Produto | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;
    try {
        const resposta = await requisitar<ProdutoDaApi>('/products', {
            method: 'PATCH',
            body: JSON.stringify(paraCorpoDeProduto(produto)),
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
        return paraProduto(resposta.data);
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}

/** BLOQUEADA pelo item 3 da secao 2 — `DELETE /products` devolve 400 sempre. */
export async function DeleteProduct(id: number): Promise<void | null> {
    const jwt = await pegarJWT();
    if (!jwt) return null;
    try {
        await requisitar<null>(`/products?id=${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Cookie: `jwt=${jwt}` },
        });
    } catch (erro) {
        if (erro instanceof ErroDeApi && erro.status === 404) return null;
        throw erro;
    }
}
