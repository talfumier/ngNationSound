import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Feature } from 'geojson';
import data from './umap.json';

@Injectable({
  providedIn: 'root'
})
export class UmapService {  //retrieves data from umap.json file
  private _center:number[]=[];
  private _zoom:number=10;

  constructor() {
    this.initData();
  }

  initData(){
    this._center=data.geometry.coordinates.reverse(); // map center point [lat, lng]
    this._zoom=data.properties.zoom; //default map zoom level
  }

  getLayers():Layer[] {
    // layers and features
    const result:Layer[]=[];
    data.layers.map((layer) => {
      result.push({name:layer._umap_options.name,features:L.geoJson(layer.features as Feature[])});      
    });
    return result;
  }

  get center(){
    return this._center;
  }
  get zoom(){
    return this._zoom;
  }
}
export interface Layer {
  name:string,
  features:L.Layer
}
