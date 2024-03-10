import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Feature } from 'geojson';
import { OverlayLayer } from '../interfaces';
import data from './umap.json';

@Injectable({
  providedIn: 'root'  // single instance for the entire application
})
export class UmapService {  //retrieves data from local umap.json file
  private _center:number[]=[];
  private _zoom:number=10;
  private _layers:OverlayLayer[]=[];

  constructor() {
    this.initData();
    this.initLayers();
  }

  initData(){
    this._center=data.geometry.coordinates.reverse(); // map center point [lat, lng]
    this._zoom=data.properties.zoom; //default map zoom level
  }

  initLayers() {
    // layers and features
    this._layers=[];
    data.layers.map((layer) => {
      this._layers.push({name:layer._umap_options.name,features:L.geoJSON(layer.features as Feature[],
        {
          style:function(feature) { //applies to polygon shapes
            return feature?.properties._umap_options;
          },    
          pointToLayer:(geoJsonPoint:any, latlng:any) => {
              return L.marker(latlng,{icon:this.getIcon(geoJsonPoint)});
          },
          onEachFeature:function (feature, layer) {
            layer.bindPopup(`<span class=popup>${feature.properties.name}</span>`);            
          }        
        } as L.GeoJSONOptions)});      
    });
  }
  getIcon(point:any):L.Icon { 
    try {
      const file=point.properties._umap_options.iconUrl.split("/").splice(-1)[0];
      return L.icon({      
        iconUrl:`assets/icons/map/${file}`,
        // shadowUrl:'assets/marker-shadow.png',
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -18],
        // tooltipAnchor: [40, -144],
        className:""
        //shadowSize: [41, 41]
      });
    } catch (error) { //default icon
      return L.icon({
        iconRetinaUrl:'assets/icons/map/default/marker-icon-2x.png',
        iconUrl:'assets/icons/map/default/marker-icon.png',
        shadowUrl:'assets/icons/map/default/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
    } 
  }

  get center(){
    return this._center;
  }
  get zoom(){
    return this._zoom;
  }
  get layers(){
    return this._layers;
  }
}
