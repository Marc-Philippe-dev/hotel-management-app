import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Hotel, IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';
import { Observable, of,  EMPTY, combineLatest,  BehaviorSubject , Subject} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'], 
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class HotelListComponent implements OnInit {
  public title = 'Liste hotels';

  public hotels$: Observable<IHotel[]> = of([]);
  public filterSubject: Subject<string> = new BehaviorSubject('');
  public showBadge: boolean = true;
  private _hotelFilter = 'mot';
  public filteredHotels$: Observable<IHotel[]> = of([]);
  public receivedRating: string;
  private errMsgSubject : Subject<string> = new Subject();
  public errMsg$ = this.errMsgSubject.asObservable()


  constructor(private hotelListService: HotelListService) {

  }

  ngOnInit() {

    this.hotels$ = this.hotelListService.updatedHotels$.pipe(
      catchError((error) => {
        this.errMsgSubject.next(error);
        return EMPTY;
      })
    )
    this.filteredHotels$ = this.createFilterHotels(this.filterSubject , this.hotels$);
 
    this.hotelFilter = '';

  }

  public filterChange(value: string): void{
    console.log('Value:', value);
    this.filterSubject.next(value)
  }


  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }

  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(filter: string) {
    this._hotelFilter = filter;

     
  }

  public createFilterHotels(filter$: Observable<string>, hotels$: Observable<IHotel[]>) {

    return combineLatest([hotels$, filter$]).pipe(
      map(([hotels, filter]) => {
        if (filter === '') return hotels;
        return hotels.filter(
          (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(filter) !== -1
        )
      }
      )
    )
     
  }

  public receiveRatingClicked(message: string): void {
    this.receivedRating = message;
  }


  private filterHotels(criteria: string, hotels: IHotel[]): IHotel[] {
    criteria = criteria.toLocaleLowerCase();

    const res = hotels.filter(
      (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) !== -1
    );

    return res;
  }
}
