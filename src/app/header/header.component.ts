import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { format } from 'date-fns';
import _ from 'lodash';
import { DataService } from '../../services/data/data.service';
import { ApiService } from '../../services/data/init/api.service';
import { FilesService } from '../../services/data/files.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private sub: Subscription = {} as Subscription;
  private _isToggled: boolean = false;
  private _dates: any = { days: [], monthYear: '' };
  private _logoId: string = '';

  constructor(
    private dataService: DataService,
    private fileService: FilesService,
    private apiService: ApiService,
    private window: Window
  ) {}

  ngOnInit(): void {
    const cols = ['dates', 'logos'];
    if (
      !this.dataService.data.dates.ready ||
      !this.dataService.data.logos.ready
    ) {
      //retrieve data from API back end
      this.sub = forkJoin(
        cols.map((col: string) => {
          return this.apiService.getApiObs('node', col); //standard data retrieval (i.e no image, no file)
        })
      ).subscribe((data) => {
        data.map((item, idx) => {
          this.apiService.formatApiData(cols[idx], item.data);
        });
        this._dates = this.getDaysMonthYear();
        // this.subs[1] = this.apiService //file and image data
        //   .getApiObs('node', 'logos', data[1].data[0].files_id)
        //   .subscribe((dta) => {
        //     this.apiService.formatApiFiles('logos', dta.data);
        //     this.dataService.displayLoading(false);
        //   });
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
  get logoId() {
    return this.dataService.logos[0]['files_id' as keyof object];
  }
  getLogoData(_id: string) {
    // return this.fileService.getFileData(_id);
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
