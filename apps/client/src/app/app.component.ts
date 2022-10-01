import { Component, OnInit } from '@angular/core';
import { ICity } from '../shared/models';

@Component({
  selector: 'trip-planner-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  lat = 37.75;
  lng = -122.41;
  city!: ICity

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
      });
    }
  }
  
  selectedCity(city: ICity) {
    if (city) {
      this.lat = city.location.lat;
      this.lng = city.location.lon
      this.city = city
    }
  }
}
