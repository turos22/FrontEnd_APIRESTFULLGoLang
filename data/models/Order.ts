import OrderItem from '@/data/models/OrderItem';
import { StatusPedido } from '@/data/models/StatusPedido';

export default interface Order {
    id: number;
    userId: number;
    orderItems: OrderItem[];
    status: StatusPedido;
}
