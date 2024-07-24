import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Observable, catchError, Subscription } from 'rxjs';
import _ from 'lodash';
import config from '../../../config/config.json';
import { DataService } from '../data.service';
import { FilesService } from './../files.service';
import { Transport } from '../../interfaces';
import { ToastService } from '../../toast.service';
import { environment } from '../../../config/environment';

@Injectable({
  providedIn: 'root', // single instance for the entire application
})
export class ApiService implements OnDestroy {
  private headers: any = {};
  private sub: Subscription = {} as Subscription;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private fileService: FilesService,
    private toastService: ToastService
  ) {
    this.headers = new HttpHeaders({
      Authorization:
        'Basic ' +
        Buffer.from(
          `${environment.wp_appUser}:${environment.wp_appPwd}`
        ).toString('base64'),
    });
  }
  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  getApiObs(api: string, col: string, files_id?: string): Observable<any> {
    //api parameter indicates which api is queried (node.js or wordpress)
    let url: string = '';
    switch (api) {
      case 'node':
        url = `${
          environment.production
            ? config.node_api_url_prod
            : config.node_api_url_dev
        }/${!files_id ? 'entities' : 'files'}/${
          !files_id ? col.slice(0, -1) : files_id + '?main=true'
        }`;
        break;
      case 'wp':
        url = `${
          environment.production ? config.wp_api_std_url : '/api'
        }/${col}?acf_format=standard&_fields=id,title,acf&per_page=100`;
    }

    return this.http
      .get(url, { headers: api === 'wp' ? this.headers : null })
      .pipe(
        catchError((error) => {
          let msg = '';
          if (error.status === 0) {
            msg = 'A client-side or network error occurred !';
            console.log('Client side error occurred :', error.error);
          } else {
            msg =
              'API backend returned an unsuccessful response code ' +
              error.status +
              ' ! Please retry later.';
            console.log(new Date(), error.status, error.error);
          }
          this.dataService.displayLoading(false);
          throw this.toastService.toastError(msg);
        })
      );
  }
  postApiObs(col: string, data: any) {
    const url = `${
      environment.production ? config.wp_api_std_url : '/api'
    }/${col}`;
    return this.http.post(url, data, { headers: this.headers }).pipe(
      catchError((error) => {
        let msg = '';
        if (error.status === 0) {
          msg = 'A client-side or network error occurred !';
          console.log('Client side error occurred :', error.error);
        } else {
          msg =
            'API backend returned an unsuccessful response code ' +
            error.status +
            ' ! Please retry later.';
          console.log(new Date(), error.status, error.error);
        }
        throw this.toastService.toastError(msg);
      })
    );
  }
  formatApiFiles(col: string, data: any, umap_pois_url?: boolean) {
    switch (col) {
      case 'logos':
      case 'artists':
      case 'partners':
        this.fileService.data[col] = {
          data,
          ready: true,
        };
    }
  }
  formatApiData(col: string, data: any, umap_pois_url?: boolean) {
    switch (col) {
      case 'messages':
        this.dataService.data.messages = {
          data: data.map((msg: any) => {
            return msg;
          }),
          ready: true,
        };
        break;
      case 'dates':
        this.dataService.data.dates = {
          data: {
            start_date: new Date(data[0].start_date),
            end_date: new Date(data[0].end_date),
          },
          ready: true,
        };
        this.dataService.data.infos = {
          data: {
            opening: data[0].opening_hours,
            street: data[0].street,
            city: data[0].city,
            lat: data[0].lat,
            lng: data[0].lng,
            transport: this.dataService.data.infos.data.transport,
          },
          ready: true,
        };
        break;
      case 'logos':
      case 'artists':
      case 'partners':
      case 'pois':
      case 'faqs':
      case 'events':
      case 'newsletters':
        this.dataService.data[col] = {
          data,
          ready: true,
        };
        break;
      case 'transports':
        this.dataService.data.infos.data.transport = {
          car: [],
          train: [],
          plane: [],
        };
        _.sortBy(data, 'title', 'asc').map((item: any) => {
          this.dataService.data.infos.data.transport[
            item.transport_mean as keyof Transport
          ].push(item.description);
        });
        break;
      case 'tickets':
        this.dataService.data.passes = {
          data: data.map((item: any) => {
            return {
              category: item.acf.category,
              pass1: item.acf.price_1day,
              pass2: item.acf.price_2days,
              pass3: item.acf.price_3days,
            };
          }),
          ready: true,
        };
        break;
      case 'umap_pois':
        if (umap_pois_url) {
          let url = data[0].acf.umap_json.url;
          url = `${
            environment.production ? config.wp_api_upload_url : '/api_uploads'
          }/${url.slice(url.indexOf('uploads') + 8 - url.length)}`;
          this.dataService.data[col] = { url, data: {}, ready: false };
        } else
          this.dataService.data[col] = {
            ...this.dataService.data[col],
            data,
            ready: true,
          };
    }
  }
}
