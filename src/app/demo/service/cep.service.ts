import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CepService {
    constructor(private http: HttpClient) {}

    // Fetch address data by CEP
    buscar(cep: string) {
        return this.http.get(`https://viacep.com.br/ws/${cep}/json/`).pipe(
            map((response: any) => response), // Pass the raw response
            catchError((error: any) => {
                console.error('Error fetching CEP:', error);
                return throwError(() => new Error('Failed to fetch CEP data.'));
            })
        );
    }

    // Fetch states
    buscarEstado() {
        return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`).pipe(
            map((response: any) => response), // Pass the raw response
            catchError((error: any) => {
                console.error('Error fetching states:', error);
                return throwError(() => new Error('Failed to fetch state data.'));
            })
        );
    }

    // Fetch cities for a given state code
    buscarCidade(code: string) {
        return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${code}/municipios`).pipe(
            map((response: any) => response), // Pass the raw response
            catchError((error: any) => {
                console.error('Error fetching cities:', error);
                return throwError(() => new Error('Failed to fetch city data.'));
            })
        );
    }
}
