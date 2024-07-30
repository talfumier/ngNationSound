import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription, forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import * as L from 'leaflet';
import { UmapService } from '../../services/map/umap.service';
import { DataService } from './../../services/data/data.service';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private map: L.Map = {} as L.Map;
  private stage: any = '';
  private _isFullScreen: boolean = false;

  @ViewChild('screenTooltip') tooltip: ElementRef = {} as ElementRef;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private apiService: ApiService,
    private umap: UmapService
  ) {
    this.stage = this.route.snapshot.paramMap.get('stage');
    if (!this.stage) return;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    document.getElementById('header-map-link')?.classList.add('active');

    if (!this.dataService.data.maps.ready) {
      //retrieve data from API back end
      this.dataService.displayLoading(true);
      if (!this.dataService.data.events.ready) {
        //page reload case > full api data reload required
        const cols = [
          'artists',
          'messages',
          'transports',
          'faqs',
          'partners',
          'pois',
          'events',
          'newsletters',
        ];
        this.subs[0] = forkJoin(
          cols.map((col: string) => {
            return this.apiService.getApiObs('node', col);
          })
        ).subscribe((data) => {
          data.map((item, idx) => {
            this.apiService.formatApiData(cols[idx], item.data);
            if (['artists', 'partners'].indexOf(cols[idx]) !== -1) {
              const _ids = _.filter(item.data, (itm) => {
                return itm.files_id;
              }).map((it) => {
                return it.files_id;
              });
              _ids.map((_id: any) => {
                this.apiService.setFileData(_id).subscribe();
              });
            }
          });
        });
      }
      this.subs[1] = this.apiService
        .getApiObs('node', 'maps')
        .subscribe((data) => {
          //retrieves map pois, format them and initialize the map.
          this.apiService.formatApiData('maps', data.data);
          const _ids = _.filter(data.data, (itm) => {
            return itm.files_id;
          }).map((it) => {
            return it.files_id;
          });
          _ids.map((_id: any) => {
            this.apiService.setFileData(_id, 'maps').subscribe(() => {
              this.map = this.umap.initMap(
                JSON.parse(atob(this.apiService.fileData[_id as keyof object])),
                this.stage
              );
              this.dataService.displayLoading(false);
            });
          });
        });
    } else {
      //api data already initialized or local data
      const _id = this.dataService.maps['files_id' as keyof object];
      this.map = this.umap.initMap(
        JSON.parse(atob(this.apiService.fileData[_id as keyof object])),
        this.stage
      );
    }
  }
  ngOnDestroy(): void {
    document.getElementById('header-map-link')?.classList.remove('active');

    this.subs.map((sub) => {
      if (Object.keys(sub).length > 0) sub.unsubscribe(); //unsubscribe to prevent memory leaks
    });
  }
  handleFullScreen(evt: Event) {
    this._isFullScreen = !this._isFullScreen;
  }
  get isFullScreen() {
    return this._isFullScreen;
  }
  handleMouseEvent(cs: number) {
    this.tooltip.nativeElement.classList.replace(
      `${cs === 1 ? 'hidden' : 'visible'}`,
      `${cs === 1 ? 'visible' : 'hidden'}`
    );
  }
}
