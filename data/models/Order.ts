import OrderItem from '@/data/models/OrderItem';
import { StatusPedido } from '@/data/models/StatusPedido';

/**
 * Espelha `OrdersResposta` de internal/entidades/orders/dto.go.
 */
export default interface Order {
    id: number;
    userId: number;
    orderItems: OrderItem[];
    status: StatusPedido;
}
