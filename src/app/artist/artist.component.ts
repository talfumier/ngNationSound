import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { DataService } from '../../services/data/data.service';
import { Artist } from '../../services/interfaces';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css',
})
export class ArtistComponent implements OnInit, OnDestroy {
  private sub: Subscription = {} as Subscription;
  private id: any = '';
  private _artist: Artist = {} as Artist;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private apiService: ApiService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) return;
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);

    if (!this.dataService.data.artists.ready) {
      //retrieve data from API back end > artists data are required in program page (should already be available from the home page api data loading)
      this.dataService.displayLoading(true);
      const cols = [
        'artists',
        'messages',
        'transports',
        'faqs',
        'partners',
        'pois',
        'events',
        'newsletters',
      ]; //page reload case > full api data reload required
      this.sub = forkJoin(
        cols.map((col: string) => {
          return this.apiService.getApiObs('node', col); //standard data retrieval (i.e no image, no file)
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
        this.initData();
        this.dataService.displayLoading(false);
      });
    } else this.initData();
  }
  initData() {
    this._artist = this.dataService.getArtistById(parseInt(this.id));
  }
  ngOnDestroy(): void {
    if (Object.keys(this.sub).length > 0) this.sub.unsubscribe(); //unsubscribe to prevent memory leaks
  }
  get artist(): Artist {
    return this._artist;
  }
  getFileData(_id?: string) {
    return _id ? this.apiService.fileData[_id as keyof object] : '';
  }
}
