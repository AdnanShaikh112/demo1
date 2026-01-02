import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = 'https://localhost:7068/api/products';

  constructor(private http: HttpClient) {}

  get(query: any): Observable<any> {

    let params = new HttpParams();
    
    Object.keys(query).forEach(key => {
      if (query[key] !== null && query[key] !== '' && query[key] !== undefined) {
        params = params.set(key, query[key]);
      }
    });

    return this.http.get(this.apiUrl, { params });
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPriceRange() {
    return this.http.get<any>(`${this.apiUrl}/price-range`);
  }

  create(data: FormData) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
