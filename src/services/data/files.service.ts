import { Injectable } from '@angular/core';
import _ from 'lodash';
import { FilesModel, File } from '../interfaces';

@Injectable({
  providedIn: 'root', // single instance for the entire application
})
export class FilesService {
  private _data: FilesModel = {
    logos: { data: {} as File, ready: false },
    artists: { data: [], ready: false },
    partners: { data: [], ready: false },
  };
  constructor() {}

  get data(): FilesModel {
    return this._data;
  }
  get logos() {
    return this._data.logos;
  }
  get artists() {
    return this._data.artists;
  }
  get partners() {
    return this._data.partners;
  }
  set files(data: any) {
    this._data = data;
  }
  getFileData(col: string, _id?: string) {
    if (!_id) return;
    const result = _.filter(
      this._data[col as keyof object]['data' as keyof object],
      (item: any) => {
        return item._id === _id;
      }
    )[0]['data' as keyof object]['data' as keyof object];
    return result;
  }
}
