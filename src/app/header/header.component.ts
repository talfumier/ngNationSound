import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { format } from 'date-fns';
import _ from 'lodash';
import { DataService } from '../../services/data/data.service';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private sub: Subscription = {} as Subscription;
  private _isToggled: boolean = false;
  private _dates: any = { days: [], monthYear: '' };
  private _logoData: string = '';

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private window: Window
  ) {}

  ngOnInit(): void {
    const cols = ['dates', 'logos'];
    if (
      !this.dataService.data.dates.ready ||
      !this.dataService.data.logos.ready
    ) {
      // retrieve data from API back end
      this.sub = forkJoin(
        cols.map((col: string) => {
          return this.apiService.getApiObs('node', col); //standard data retrieval (i.e no image, no file)
        })
      ).subscribe((data) => {
        data.map((item, idx) => {
          this.apiService.formatApiData(cols[idx], item.data);
        });
        const _id = data[1].data[0].files_id;
        this.apiService.setFileData(_id).subscribe((data) => {
          this._logoData = data[_id];
        });

        this._dates = this.getDaysMonthYear();
      });
    } else this._dates = this.getDaysMonthYear(); //api data already initialized
  }
  getDaysMonthYear() {
    const days = _.range(
      this.dataService.dates.start_date.getDate(),
      this.dataService.dates.end_date.getDate() + 1
    );
    const monthYear = format(
      new Date(
        this.dataService.dates.start_date.getFullYear(), //work-around to avoid 'invalid date' warning on ios devices
        this.dataService.dates.start_date.getMonth(),
        days[0]
      ),
      'MMMM yyyy'
    );
    return { days, monthYear };
  }
  ngOnDestroy(): void {
    if (Object.keys(this.sub).length > 0) this.sub.unsubscribe();
  }
  get isToggled(): boolean {
    return this._isToggled;
  }
  get dates() {
    return this._dates;
  }
  get logoData() {
    return this._logoData;
  }
  handleToggle() {
    this._isToggled = !this._isToggled;
  }
  handleClick(event?: Event) {
    this.window.scrollTo(0, 0);
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (window.outerWidth >= 450) this._isToggled = false;
  }
}
