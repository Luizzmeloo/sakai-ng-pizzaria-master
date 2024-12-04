import { Component, OnInit } from '@angular/core';
import { Pizza } from 'src/app/demo/api/pizza.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PizzaService } from 'src/app/demo/service/pizza.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    pizzaDialog: boolean = false;

    deletePizzaDialog: boolean = false;

    deletePizzasDialog: boolean = false;

    pizzas: Pizza[] = [];

    pizza: Pizza = {};

    selectedPizzas: Pizza[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private pizzaService: PizzaService, private messageService: MessageService) { }

    ngOnInit() {
        this.pizzaService.getPizzas().subscribe(data => this.pizzas = data);

        this.cols = [
            { field: 'product', header: 'Pizza' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    openNew() {
        this.pizza = {};
        this.submitted = false;
        this.pizzaDialog = true;
    }

    deleteSelectedPizzas() {
        this.deletePizzasDialog = true;
    }

    editPizza(pizza: Pizza) {
        this.pizza = { ...pizza };
        this.pizzaDialog = true;
    }

    deletePizza(pizza: Pizza) {
        this.deletePizzaDialog = true;
        this.pizza = { ...pizza };
    }

    confirmDeleteSelected() {
        this.deletePizzasDialog = false;
        // this.pizzas = this.pizzas.filter(val => !this.selectedPizzas.includes(val));
        
        this.pizzaService.deletePizza(this.pizza.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizzas Deleted', life: 3000 });
        this.selectedPizzas = [];
    }

    confirmDelete() {
        this.deletePizzaDialog = false;
        // this.pizzas = this.pizzas.filter(val => val.id !== this.pizza.id);
        this.pizzaService.deletePizza(this.pizza.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizza Deleted', life: 3000 });
        this.pizza = {};
    }

    hideDialog() {
        this.pizzaDialog = false;
        this.submitted = false;
    }

    savePizza() {
        this.submitted = true;

        if (this.pizza.name?.trim()) {
            if (this.pizza.id) {
                // @ts-ignore
                this.pizza.inventoryStatus = this.pizza.inventoryStatus.value ? this.pizza.inventoryStatus.value : this.pizza.inventoryStatus;
                // this.pizzas[this.findIndexById(this.pizza.id)] = this.pizza;
                this.pizzaService.updatePizza(this.pizza.key, this.pizza);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizza Updated', life: 3000 });
            } else {
                this.pizza.id = this.createId();
                this.pizzaService.createPizza(this.pizza);
                // @ts-ignore
                this.pizza.inventoryStatus = this.pizza.inventoryStatus ? this.pizza.inventoryStatus.value : 'INSTOCK';
                // this.pizzas.push(this.pizza);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizza Created', life: 3000 });
            }

            this.pizzas = [...this.pizzas];
            this.pizzaDialog = false;
            this.pizza = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.pizzas.length; i++) {
            if (this.pizzas[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
