import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private baseUrl = 'https://pizzaria-nr-angular-default-rtdb.firebaseio.com/products.json';

    constructor(private http: HttpClient) {}

    // Fetch all products from Firebase
    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl).pipe(
            map((response) => {
                const products: any[] = [];
                for (const key in response) {
                    if (response.hasOwnProperty(key)) {
                        products.push({ ...response[key], key }); // Include the Firebase key
                    }
                }
                return products;
            })
        );
    }
}
