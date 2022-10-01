import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  Observable,
  catchError,
  concat,
  map,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { ICity } from '../../models';
import { CommonModule } from '@angular/common';
import { EnumFormatterPipeModule } from '../../pipe/enum-formatter.pipe';

@Component({
  selector: 'trip-planner-search',
  styleUrls: ['./trip-search.component.scss'],
  templateUrl: './trip-search.component.html',
})
export class TripSearchComponent implements OnInit {
  @ViewChild('search', { static: false }) searchField!: ElementRef;

  cities$!: Observable<ICity[]>;
  citiesLoading!: boolean;
  citiesInput$ = new Subject<string>();
  city!: ICity

  trips!: ICity[]

  @Output() emitSelectedCity = new EventEmitter()

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadCities();
  }

  private loadCities() {
    this.cities$ = concat(
      of([]), // default items
      this.citiesInput$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => (this.citiesLoading = true)),
        switchMap((term) =>
          this.tripService.listCities(term?.length == 0 ? '' : term).pipe(
            map((result: any) => result = result.items),
            catchError(() => of([])), // empty list on error
            tap(() => this.citiesLoading = false)
          )
        )
      )
    );
  }

  trackByFn(item: any) {
    return item.id;
  }

  async selectedCity(event: ICity) {
    if (event) {
      this.emitSelectedCity.emit(event)
      const result: any = await this.tripService.createTrip(event.name).toPromise();
      if (result) {
        this.trips = result.items
      }
    }
  }

  selected(item: ICity) {
    this.emitSelectedCity.emit(item)
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, EnumFormatterPipeModule],
  exports: [TripSearchComponent],
  declarations: [TripSearchComponent],
  providers: [],
})
export class TripSearchModule {}
