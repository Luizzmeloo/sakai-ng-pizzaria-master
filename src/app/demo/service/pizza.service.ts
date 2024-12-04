import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pizza } from '../api/pizza.model';

@Injectable(
    { providedIn: 'root' }
)
export class PizzaService {
    private basePath = "pizza"

    constructor( private db: AngularFireDatabase) { }

    createPizza(pizza: Pizza): any {
        return this.db.list<Pizza>(this.basePath).push(pizza);
    }

    getPizzas() {
        return this.db.list<Pizza>(this.basePath).snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    getPizzaId(key: string): Observable<Pizza> {
        return this.db.object<Pizza>(`${this.basePath}/${key}`).valueChanges();
    }

    updatePizza(key: string, value: any): Promise<void> {
        return this.db.object<Pizza>(`${this.basePath}/${key}`).update(value);
    }

    deletePizza(key: string): Promise<void> {
        return this.db.object<Pizza>(`${this.basePath}/${key}`).remove();
    }
   
}
