import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Observable, catchError, Subscription } from 'rxjs';
import _ from 'lodash';
import { DataService } from '../data.service';
import { environment } from '../../../config/environment';

@Injectable({
  providedIn: 'root', // single instance for the entire application
})
export class ApiService implements OnDestroy {
  private headers: any = {};
  private sub: Subscription = {} as Subscription;
  private _fileData: object = {} as object;

  constructor(private http: HttpClient, private dataService: DataService) {
    this.headers = new HttpHeaders({
      Authorization:
        'Basic ' +
        Buffer.from(
          `${environment.wp_appUser}:${environment.wp_appPwd}`
        ).toString('base64'),
    });
  }
  ngOnDestroy(): void {
    if (Object.keys(this.sub).length > 0) this.sub.unsubscribe();
  }

  getApiObs(api: string, col: string, files_id?: string): Observable<any> {
    //api parameter indicates which api is queried (node.js or wordpress)
    let url: string = '';
    switch (api) {
      case 'node':
        url = `${
          environment.production
            ? environment.node_api_url_prod
            : environment.node_api_url_dev
        }/${
          !files_id
            ? 'entities/' + col.slice(0, -1)
            : 'files/' + files_id + '?main=true'
        }${files_id && col === 'maps' ? '&map=true' : ''}`;
        break;
      case 'wp':
        url = `${
          environment.production ? environment.wp_api_std_url : '/api'
        }/${col}?acf_format=standard&_fields=id,title,acf&per_page=100`;
    }

    return this.http
      .get(url, { headers: api === 'wp' ? this.headers : null })
      .pipe(
        catchError((error) => {
          //catching of http errors done in http-interceptor service
          throw this.dataService.displayLoading(false);
        })
      );
  }
  postApiObs(data: any, col: string) {
    const url = `${
      environment.production
        ? environment.node_api_url_prod
        : environment.node_api_url_dev
    }${col}`;
    return this.http.post(url, data).pipe(
      catchError((error) => {
        //catching of http errors done in http-interceptor service
        throw this.dataService.displayLoading(false);
      })
    );
  }
  get fileData() {
    return this._fileData;
  }
  setFileData(_id: string, col?: string): Observable<any> {
    //file and image data
    return new Observable<any>((item) => {
      this.sub = this.getApiObs('node', col ? col : '', _id).subscribe(
        (fileContainer) => {
          this._fileData = {
            ...this._fileData,
            [_id]: fileContainer.data.data,
          };
          item.next(this._fileData);
        }
      );
    });
  }
}
