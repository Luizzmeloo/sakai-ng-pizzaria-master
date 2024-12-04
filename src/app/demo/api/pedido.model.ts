import { Cliente } from './cliente.model'; 
import { Pizza } from './pizza.model'; 

export interface Pedido {
    id?: string; 
    cliente: Cliente;
    itens: Pizza[]; 
    total: number; 
    dataPedido: Date;
}
