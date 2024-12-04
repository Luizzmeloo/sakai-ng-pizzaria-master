import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/demo/api/cliente.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ClienteService } from 'src/app/demo/service/cliente.service';
import { CepService } from 'src/app/demo/service/cep.service'; // Import CepService
import { from } from 'rxjs';

@Component({
    templateUrl: './cliente.component.html',
    providers: [MessageService],
})
export class CrudClienteComponent implements OnInit {
    clienteDialog: boolean = false;

    deleteClienteDialog: boolean = false;

    deleteClientesDialog: boolean = false;

    clientes: Cliente[] = [];

    cliente: Cliente = this.createEmptyCliente();

    selectedClientes: Cliente[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    sexos: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private clienteService: ClienteService,
        private cepService: CepService, // Inject CepService
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.clienteService.getClientes().subscribe((data) => (this.clientes = data));

        this.cols = [
            { field: 'nome', header: 'Cliente' },
            { field: 'telefone', header: 'Telefone' },
            { field: 'cidade', header: 'Cidade' },
            { field: 'estado', header: 'Estado' },
            { field: 'sexo', header: 'Sexo' },
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ];

        this.sexos = [
            { label: 'Masculino', value: 'Masculino' },
            { label: 'Feminino', value: 'Feminino' },
            { label: 'Outro', value: 'Outro' },
        ];
    }

    buscarCep() {
        if (this.cliente.cep && this.cliente.cep.length === 8) {
            this.cepService.buscar(this.cliente.cep).subscribe({
                next: (data: any) => {
                    // Dynamically update address fields
                    this.cliente.estado = data.uf || '';
                    this.cliente.cidade = data.localidade || '';
                    this.cliente.bairro = data.bairro || '';
                    this.cliente.rua = data.logradouro || '';
                },
                error: (err) => {
                    console.error('Error fetching CEP:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'CEP inválido ou não encontrado',
                        life: 3000,
                    });
                },
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Por favor, insira um CEP válido',
                life: 3000,
            });
        }
    }

    openNew() {
        this.cliente = this.createEmptyCliente();
        this.submitted = false;
        this.clienteDialog = true;
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    saveCliente() {
        this.submitted = true;
    
        // Check if the form is valid
        if (this.cliente.nome?.trim()) {
            if (this.cliente.id) {
                // Edit existing cliente
                from(this.clienteService.updateCliente(this.cliente.key, this.cliente)).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Cliente Updated',
                            life: 3000,
                        });
                        // Update the local cliente list
                        this.clientes = this.clientes.map((val) =>
                            val.id === this.cliente.id ? { ...this.cliente } : val
                        );
                        this.closeDialog();
                    },
                    error: (err) => {
                        console.error('Error updating cliente:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao atualizar o cliente',
                            life: 3000,
                        });
                    },
                });
            } else {
                // Create new cliente
                this.cliente.id = this.createId();
                from(this.clienteService.createCliente(this.cliente)).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Cliente Created',
                            life: 3000,
                        });
                        this.clientes.push({ ...this.cliente }); // Add new cliente to the local list
                        this.closeDialog();
                    },
                    error: (err) => {
                        console.error('Error creating cliente:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao criar o cliente',
                            life: 3000,
                        });
                    },
                });
            }
        } else {
            // Show error if the form is invalid
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Nome é obrigatório',
                life: 3000,
            });
        }
    }
    
    closeDialog() {
        this.clienteDialog = false;
        this.submitted = false;
        this.cliente = this.createEmptyCliente(); // Reset form
    }
    

    createEmptyCliente(): Cliente {
        return {
            nome: '',
            cep: '',
            telefone: '',
            id: '',
            key: '',
            cpf: '',
            sexo: 'Masculino',
            estado: '',
            cidade: '',
            bairro: '',
            rua: '',
        };
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

    editCliente(cliente: Cliente) {
        this.cliente = { ...cliente }; // Create a copy of the selected client to avoid mutating the original data
        this.clienteDialog = true; // Open the dialog for editing
        this.submitted = false; // Reset submission state
    }
    
    deleteCliente(cliente: Cliente) {
        // Confirm deletion
        this.deleteClienteDialog = true; // Open confirmation dialog
        this.cliente = { ...cliente }; // Set the cliente to be deleted
    }
    
    confirmDelete() {
        this.deleteClienteDialog = false; // Close confirmation dialog
    
        // Call the delete service method
        from(this.clienteService.deleteCliente(this.cliente.key)).subscribe({
            next: () => {
                // Remove cliente from the local list
                this.clientes = this.clientes.filter((val) => val.id !== this.cliente.id);
    
                // Show success message
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Cliente Deleted',
                    life: 3000,
                });
    
                // Reset the cliente object
                this.cliente = this.createEmptyCliente();
            },
            error: (err) => {
                console.error('Error deleting cliente:', err);
    
                // Show error message
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao apagar o cliente',
                    life: 3000,
                });
            },
        });
    }
    

}
