import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'trip-planner-map',
  styleUrls: ['./map.component.scss'],
  template: `<div class="map" id="map"></div>`,
})
export class MapComponent implements OnInit, OnChanges {
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';

  @Input() lat = 37.75;
  @Input() lng = -122.41;
  @Input() selectedCity!: ICity;

  source!: mapboxgl.AnySourceImpl;
  marker!: mapboxgl.Marker;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.initialiseMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const hasCoordinates = changes?.['lat']?.currentValue;
    if (hasCoordinates) {
      this.lat = changes?.['lat']?.currentValue;
      this.lng = changes?.['lng']?.currentValue;
    
      if (this.map) {
        this.map.flyTo({
            center: [this.lng, this.lat],
        });

        if (this.selectedCity) {
            this.addMarker(this.lng, this.lat);
        }
      }
    }
  }

  initialiseMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 4,
      center: [this.lng, this.lat], // starting position [lng, lat]
      projection: {
        name: 'globe',
      }, // display the map as a 3D globe
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.loadMap();
  }

  loadMap() {
    this.map.on('load', (event) => {
      this.map.setFog({}); // Set the default atmosphere style

      if (this.selectedCity) {
        this.map.addSource('trip-planner', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [this.lng, this.lat],
                },
                properties: {
                  title: '',
                },
              },
            ],
          },
        });

        this.source = this.map.getSource('trip-planner');
        // this.removeMarker()
        this.addMarker(this.lng, this.lat)

        this.map.addLayer({
          id: 'trip-planner',
          type: 'symbol',
          source: 'trip-planner',
          layout: {
            'icon-image': 'custom-marker',
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 1.25],
            'text-anchor': 'top',
          },
        });
      }
    });
  }

  addMarker(lat: number, lng: number) {
     this.marker = new mapboxgl.Marker({
      draggable: false,
    })
      .setLngLat([lat, lng])
      .addTo(this.map);
  }

  removeMarker() {
    this.marker.remove()
  }
}

import { NgModule } from '@angular/core';
import { ICity } from '../../models';

@NgModule({
  imports: [],
  exports: [MapComponent],
  declarations: [MapComponent],
  providers: [],
})
export class MapModule {}
