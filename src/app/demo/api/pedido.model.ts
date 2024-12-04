import { Cliente } from './cliente.model'; // Adjust path if Cliente model is elsewhere
import { Pizza } from './pizza.model'; // Adjust path if Pizza model is elsewhere

export interface Pedido {
    id?: string; // Optional ID for unique identification
    cliente: Cliente; // The client making the order
    itens: Pizza[]; // The list of items (pizzas)
    total: number; // Total cost of the order
    dataPedido: Date; // Date of the order
}
