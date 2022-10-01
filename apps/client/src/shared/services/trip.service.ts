import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICity, ITrip } from '../models';

@Injectable({providedIn: 'root'})
export class TripService {
    
    constructor(private http: HttpClient) { }

    listCities(query: string): Observable<ICity[]> {
        return this.http.get<ICity[]>(`${environment.apiURL}/trip/cities`, {params: {search: query}})
    }
    
    createTrip(city: string): Observable<ITrip[]> {
        return this.http.post<ITrip[]>(`${environment.apiURL}/trip/create`, city)
    }
}