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
      result.push({name:layer._umap_options.name,features:L.geoJSON(layer.features as Feature[],
        {
          style:function(feature) { //applies to polygon shapes
            return feature?.properties._umap_options;
          },    
          pointToLayer:(geoJsonPoint:any, latlng:any) => {
              return L.marker(latlng,{icon:this.getIcon(geoJsonPoint)});
          },
          onEachFeature:function (feature, layer) {
            layer.bindPopup(`<span style="font-size:1.3rem;">${feature.properties.name}</span>`);            
          }        
        } as L.GeoJSONOptions)});      
    });
    return result;
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
}
export interface Layer {
  name:string,
  features:L.Layer
}
