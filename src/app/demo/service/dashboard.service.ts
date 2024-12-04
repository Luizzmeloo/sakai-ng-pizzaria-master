import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(private db: AngularFireDatabase) {}

    // Method to fetch total orders
    getTotalOrders(): Observable<number> {
        return this.db.object<number>('totalOrders').valueChanges();
    }

    // Method to fetch total products
    getTotalProducts(): Observable<number> {
        return this.db.object<number>('totalProducts').valueChanges();
    }

    // Method to fetch total users
    getTotalUsers(): Observable<number> {
        return this.db.object<number>('totalUsers').valueChanges();
    }
}
