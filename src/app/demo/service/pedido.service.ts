import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido } from '../api/pedido.model';

@Injectable(
    { providedIn: 'root' }
)
export class PedidoService {
    private basePath = "pedido"

    constructor( private db: AngularFireDatabase) { }

    createPedido(pedido: Pedido): any {
        return this.db.list<Pedido>(this.basePath).push(pedido);
    }

    getPedidos() {
        return this.db.list<Pedido>(this.basePath).snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    getPedidoId(key: string): Observable<Pedido> {
        return this.db.object<Pedido>(`${this.basePath}/${key}`).valueChanges();
    }

    updatePedido(key: string, value: any): Promise<void> {
        return this.db.object<Pedido>(`${this.basePath}/${key}`).update(value);
    }

    deletePedido(key: string): Promise<void> {
        return this.db.object<Pedido>(`${this.basePath}/${key}`).remove();
    }
   
}
