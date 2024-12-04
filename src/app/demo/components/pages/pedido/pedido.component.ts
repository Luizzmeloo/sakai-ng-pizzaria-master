import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/demo/api/pedido.model';
import { Cliente } from 'src/app/demo/api/cliente.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PedidoService } from 'src/app/demo/service/pedido.service';
import { ClienteService } from 'src/app/demo/service/cliente.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { PizzaService } from 'src/app/demo/service/pizza.service';
import { Pizza } from 'src/app/demo/api/pizza.model';

@Component({
    templateUrl: './pedido.component.html',
    providers: [MessageService],
})
export class PedidoComponent implements OnInit {
    pedidoDialog: boolean = false;
    deletePedidoDialog: boolean = false;
    deletePedidosDialog: boolean = false;

    pedidos: Pedido[] = [];
    clientes: Cliente[] = []; // List of clientes

    itens: Pizza[] = [];

    pedido: Pedido = this.createEmptyPedido();
    selectedPedidos: Pedido[] = [];

    submitted: boolean = false;

    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private pedidoService: PedidoService,
        private clienteService: ClienteService,
        private productService: ProductService,
        private pizzaService: PizzaService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        // Fetch products from Firebase
        this.pizzaService.getPizzas().subscribe((data) => {
            this.itens = data.map((pizza) => ({
                ...pizza, // Retain all existing properties
                id: pizza.key, // Use the `key` as a unique identifier
            }));
            console.log('Normalized Products:', this.itens);
        });

        // Fetch clientes
        this.clienteService.getClientes().subscribe((data) => {
            this.clientes = data;
        });

        // Fetch pedidos
        this.pedidoService.getPedidos().subscribe((data) => {
            this.pedidos = data;
        });

        // Column configuration
        this.cols = [
            { field: 'cliente.nome', header: 'Cliente' },
            { field: 'itens', header: 'Itens' },
            { field: 'total', header: 'Total' },
            { field: 'dataPedido', header: 'Data do Pedido' },
        ];
    }

    openNew() {
        this.pedido = this.createEmptyPedido();
        this.submitted = false;
        this.pedidoDialog = true;
    }

    deleteSelectedPedidos() {
        this.deletePedidosDialog = true;
    }

    editPedido(pedido: Pedido) {
        this.pedido = { ...pedido }; // Deep copy to avoid modifying original data
        this.pedidoDialog = true;
    }

    deletePedido(pedido: Pedido) {
        this.deletePedidoDialog = true;
        this.pedido = { ...pedido };
    }

    confirmDeleteSelected() {
        this.deletePedidosDialog = false;
        this.pedidoService.deletePedido(this.pedido.id).then(() => {
            this.pedidos = this.pedidos.filter((val) => !this.selectedPedidos.includes(val));
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedidos Deleted', life: 3000 });
            this.selectedPedidos = [];
        });
    }

    confirmDelete() {
        this.deletePedidoDialog = false;
        this.pedidoService.deletePedido(this.pedido.id).then(() => {
            this.pedidos = this.pedidos.filter((val) => val.id !== this.pedido.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Deleted', life: 3000 });
            this.pedido = this.createEmptyPedido();
        });
    }

    hideDialog() {
        this.pedidoDialog = false;
        this.submitted = false;
    }

    savePedido() {
        this.submitted = true;

        // Validate cliente and itens
        if (this.pedido.cliente && this.pedido.itens && this.pedido.itens.length > 0) {
            // Calculate total price
            this.pedido.total = this.pedido.itens.reduce((sum, product) => sum + product.price, 0);

            if (this.pedido.id) {
                // Update existing pedido
                this.pedidoService.updatePedido(this.pedido.id, this.pedido).then(() => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Updated', life: 3000 });
                    this.pedidos = this.pedidos.map((val) => (val.id === this.pedido.id ? this.pedido : val));
                });
            } else {
                // Create new pedido
                this.pedido.id = this.createId();
                this.pedidoService.createPedido(this.pedido).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Created', life: 3000 });
                    this.pedidos.push({ ...this.pedido });
                });
            }

            this.pedidoDialog = false;
            this.pedido = this.createEmptyPedido();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Cliente e itens são obrigatórios.',
                life: 3000,
            });
        }
    }

    createEmptyPedido(): Pedido {
        return {
            cliente: null,
            itens: [],
            total: 0,
            dataPedido: new Date(),
        };
    }

    createId(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    debugItens() {
        console.log('Available Products:', this.itens);
        console.log('Selected Itens:', this.pedido.itens);
    }
    
}
