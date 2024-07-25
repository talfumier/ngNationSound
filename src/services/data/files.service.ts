import { Injectable } from '@angular/core';
import { Subscription, forkJoin, switchMap, timer } from 'rxjs';
import _ from 'lodash';
import { FilesModel, File } from '../interfaces';
import { ApiService } from './init/api.service';

@Injectable({
  providedIn: 'root', // single instance for the entire application
})
export class FilesService {
  private sub: Subscription = {} as Subscription;
  // private _data: FilesModel = {
  //   logos: { data: {} as File, ready: false },
  //   artists: { data: [], ready: false },
  //   partners: { data: [], ready: false },
  // };
  private _data: object = {};
  constructor(private apiService: ApiService) {}

  get data() {
    return this._data;
  }
  // get logos() {
  //   return this._data.logos;
  // }
  // get artists() {
  //   return this._data.artists;
  // }
  // get partners() {
  //   return this._data.partners;
  // }
  set files(data: any) {
    this._data = data;
  }
  getFileData(_id: string) {
    if (!_id) return;
    let result = this._data[_id as keyof object];
    console.log(_id, result);
    if (result) return result;
    this.apiService.getApiObs('node', '', _id).subscribe((data) => {
      console.log(_id, data);
      // this._data[_id as keyof object] = data;
    });
    return '';
  }
}
