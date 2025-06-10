import type { ApiResponse } from '../types';
import api from './api';

export interface OrderItem {
    id: number;
    productName: string;
    quantity: number;
    productPrice: number;
    totalPrice: number;
}

export interface Order {
    id: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
    account?: {
        id: number;
        name: string;
        email: string;
    } | null;
    orderItems: OrderItem[];
}

export interface UpdateOrderStatusRequest {
    status: string;
}

class OrderService {
    // Get all orders
    async getOrders(): Promise<ApiResponse<Order[]>> {
        const response = await api.get('/api/orders');
        return {
            ...response.data,
            data: response.data.data.orders
        };
    }

    // Get order by ID
    async getOrderById(id: number): Promise<ApiResponse<Order>> {
        const response = await api.get(`/api/orders/${id}`);
        return response.data;
    }

    // Update order status
    async updateOrderStatus(orderId: number, statusData: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> {
        const response = await api.patch(`/api/orders/${orderId}/status`, statusData);
        return response.data;
    }
}

// Export singleton instance
const orderService = new OrderService();
export default orderService;

// Export individual methods for convenience
export const {
    getOrders,
    getOrderById,
    updateOrderStatus
} = orderService;