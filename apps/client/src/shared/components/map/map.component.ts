import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapService } from '../../services/map.service';

@Component({
    selector: 'trip-planner-map',
    styleUrls: ['./map.component.scss'],
    template: `<div class="map" id="map"></div>`
})

export class MapComponent implements OnInit {

    map!: mapboxgl.Map
    style = "mapbox://styles/mapbox/outdoors-v9"

    lat = 37.75;
    lng = -122.41;

    constructor(private mapService: MapService) { }
   
    ngOnInit(): void {
        this.initialiseMap()
    }

    initialiseMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.map.flyTo({
                    center: [this.lng, this.lat]
                })
            });
        }

        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 4,
            center: [this.lng, this.lat], // starting position [lng, lat]
            projection: {
                name: 'globe'
            } // display the map as a 3D globe
        })

        this.map.addControl(new mapboxgl.NavigationControl());

        // //// Add Marker on Click
        // this.map.on('click', (event) => {
        // })


        /// Add realtime firebase data on map load
        this.map.on('load', (event) => {
            this.map.setFog({}); // Set the default atmosphere style
        })
    }
}

import { NgModule } from '@angular/core';

@NgModule({
    imports: [],
    exports: [MapComponent],
    declarations: [MapComponent],
    providers: [],
})
export class MapModule { }
