import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'trip-planner-search',
  styleUrls: ['./trip-search.component.scss'],
  templateUrl: './trip-search.component.html',
})
export class TripSearchComponent implements OnInit {
  @ViewChild('search', { static: false }) searchField!: ElementRef;

  cities$!: Observable<any>;
  citiesLoading!: boolean;
  citiesInput$ = new Subject<string>();

  selectedCity!: ICity;

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
}

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule],
  exports: [TripSearchComponent],
  declarations: [TripSearchComponent],
  providers: [],
})
export class TripSearchModule {}
