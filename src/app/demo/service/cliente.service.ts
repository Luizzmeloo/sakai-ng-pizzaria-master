import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../api/cliente.model';

@Injectable(
    { providedIn: 'root' }
)
export class ClienteService {
    private basePath = "cliente"

    constructor( private db: AngularFireDatabase) { }

    createCliente(cliente: Cliente): any {
        return this.db.list<Cliente>(this.basePath).push(cliente);
    }

    getClientes() {
        return this.db.list<Cliente>(this.basePath).snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    getClienteId(key: string): Observable<Cliente> {
        return this.db.object<Cliente>(`${this.basePath}/${key}`).valueChanges();
    }

    updateCliente(key: string, value: any): Promise<void> {
        return this.db.object<Cliente>(`${this.basePath}/${key}`).update(value);
    }

    deleteCliente(key: string): Promise<void> {
        return this.db.object<Cliente>(`${this.basePath}/${key}`).remove();
    }
   
}
