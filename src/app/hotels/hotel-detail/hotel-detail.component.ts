import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit, OnDestroy {

  public hotel: IHotel = <IHotel>{};
  public hotel$: Observable<IHotel> = of(<IHotel>{});
  public subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('id');

    this.hotel$ = this.hotelService.getHotels()
      .pipe(
        map((hotels: IHotel[]) => hotels.find(hotel => hotel.id === id)),
        tap((hotel: IHotel) => console.log(hotel))
      )

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public backToList(): void {
    this.router.navigate(['/hotels']);
  }

}
