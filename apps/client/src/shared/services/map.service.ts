import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import mapboxgl from 'mapbox-gl'

@Injectable({providedIn: 'root'})
export class MapService {
    
    constructor() {
        mapboxgl.accessToken = environment.mapToken
     }
    
}