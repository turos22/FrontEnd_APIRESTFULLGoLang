import OrderItem from '@/data/models/OrderItem';

/**
 * Espelha `OrdersResposta` de internal/entidades/orders/dto.go.
 * `status`, total e data ainda nao saem na resposta da API — quando sairem,
 * entram aqui e em `paraPedido`.
 */
export default interface Order {
    id: number;
    userId: number;
    orderItems: OrderItem[];
}
