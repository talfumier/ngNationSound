import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin, switchMap, timer } from 'rxjs';
import _ from 'lodash';
import config from '../../config/config.json';
import { ApiService } from '../../services/data/init/api.service';
import { DataService } from '../../services/data/data.service';
import { FilesService } from '../../services/data/files.service';
import {
  Infos,
  Faq,
  Message,
  Artist,
  Model,
  Newsletter,
} from '../../services/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs: Subscription[] = [];
  private _artists: Artist[] = [];
  private _messages: Message[] = [];
  private _innerHTML: string[] = [];
  private _infos: Infos = {} as Infos;
  private _faqs: Faq[] = [];
  private _partners: any[] = [];
  private _newsletters: Newsletter[] = [];
  static scrollY: number;

  constructor(
    private dataService: DataService,
    private fileService: FilesService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.getElementById('home-link')?.classList.add('active');

    const cols = [
      'artists',
      'messages',
      'transports',
      'faqs',
      'partners',
      'pois',
      'events',
      'newsletters',
    ]; //dates and logos api data uploaded in the header component
    const ready = cols.map((key: string) => {
      return this.dataService.data[
        (key !== 'transports' ? key : 'infos') as keyof Model
      ].ready;
    });
    if (ready.indexOf(false) !== -1) {
      //page reload case > full api data reload required
      this.dataService.displayLoading(true);
      this.subs[0] = forkJoin(
        cols.map((col: string) => {
          return this.apiService.getApiObs('node', col); //standard data retrieval (i.e no image, no file)
        })
      ).subscribe((data) => {
        data.map((item, idx) => {
          this.apiService.formatApiData(cols[idx], item.data);
          //file and image data
          // if (cols[idx] === 'artists' || cols[idx] === 'partners') {
          //   this.subs[1] = forkJoin(
          //     item.data.map((itm: any) => {
          //       return this.apiService.getApiObs(
          //         'node',
          //         cols[idx],
          //         itm.files_id
          //       );
          //     })
          //   ).subscribe((dta) => {
          //     this.apiService.formatApiFiles(
          //       cols[idx],
          //       (dta as Array<object>).map((obj) => {
          //         return obj['data' as keyof object];
          //       })
          //     );
          //   });
          // }
        });
        this.initData(true);
        this.dataService.displayLoading(false);
      });
    } else this.initData(true); //api data already initialized

    //api data refresh without page reload
    const cls = ['messages', 'events']; //only messages and events data likely to change
    this.subs[1] = timer(config.refresh_interval, config.refresh_interval)
      .pipe(
        switchMap(() => {
          return forkJoin(
            cls.map((col: string) => {
              return this.apiService.getApiObs('node', col);
            })
          );
        })
      )
      .subscribe((data) => {
        data.map((item, idx) => {
          this.apiService.formatApiData(cls[idx], item);
        });
        this.initData(false);
      });
  }
  initData(full: boolean) {
    if (full) {
      this._artists = this.dataService.artists;
      this._infos = this.dataService.infos;
      this._faqs = this.dataService.faqs;
      this._partners = this.dataService.partners;
    }
    this._messages = _.sortBy(
      _.filter(this.dataService.messages, (msg) => {
        return msg.active;
      }) as Message[],
      'order',
      'asc'
    );
    this.dataService.initInnerHTML();
    this._innerHTML = this.dataService.innerHTML;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      window.scrollTo(0, HomeComponent.scrollY);
    }, 100);
  }
  ngOnDestroy(): void {
    HomeComponent.scrollY = window.scrollY; // record scroll position to be able to return at the same position
    document.getElementById('home-link')?.classList.remove('active');

    this.subs.map((sub) => {
      if (Object.keys(sub).length > 0) sub.unsubscribe(); //unsubscribe to prevent memory leaks
    });
  }
  get slideConfig() {
    return config.carouselConfig;
  }
  get artists() {
    return this._artists;
  }
  get messages() {
    return this._messages;
  }
  get innerHTML(): string[] {
    return this._innerHTML;
  }
  get infos() {
    return this._infos;
  }
  get faqs() {
    return this._faqs;
  }
  get partners() {
    return this._partners;
  }
  get newsletters() {
    return this._newsletters;
  }
  getFileData(col: string, _id?: string) {
    // return this.fileService.getFileData(_id);
    return '';
  }

  @HostListener('click', ['$event']) // prevent page reload when launching an anchor link
  onClick(event: MouseEvent) {
    if (event.target instanceof HTMLAnchorElement === false) return;
    event.preventDefault(); // Prevent page from reloading
    const target = <HTMLAnchorElement>event.target;
    this.router.navigate([target.pathname]);
  }
}
