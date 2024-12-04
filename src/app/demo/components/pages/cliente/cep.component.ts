import { Component } from '@angular/core';
import { CepService } from '../../../service/cep.service';

@Component({
    selector: 'app-cep',
    templateUrl: './cep.component.html',
})
export class CepComponent {
    cep: string = ''; // Input CEP
    estado: string = ''; // Estado
    bairro: string = ''; // Bairro
    rua: string = ''; // Rua

    constructor(private cepService: CepService) {}

    buscarCep() {
        if (this.cep) {
            this.cepService.buscar(this.cep).subscribe({
                next: (data: any) => {
                    // Update fields dynamically based on response
                    this.estado = data.uf || '';
                    this.bairro = data.bairro || '';
                    this.rua = data.logradouro || '';
                },
                error: (err) => {
                    console.error('Error fetching CEP data:', err);
                    alert('CEP inválido ou não encontrado.');
                },
            });
        }
    }
}
