import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import _ from 'lodash';
import { Feature } from 'geojson';
import { OverlayLayer } from '../interfaces';
import { removeAccents } from '../../app/utilities/functions/utlityFunctions';

@Injectable({
  providedIn: 'root'  // single instance for the entire application
})
export class UmapService {  
  
  initMap(data:object,stage:any): L.Map {
    //base layer
    const osm=L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: data["zoom" as keyof object]+2,
      minZoom: data["zoom" as keyof object]-4,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });    
    
    const layers:OverlayLayer[]=this.initLayers(data);   
    const center=_.cloneDeep(data["geometry" as keyof object]["coordinates" as keyof object]as Array<any>) ;
    const map = L.map("map", {
      center: center.reverse() as L.LatLngExpression, // map center point [lat, lng]
      zoom: data["properties" as keyof object]["zoom" as keyof object], //default map zoom level
      layers: [osm,...layers.map((layer) => { // base layer + overlay layers
        return layer.features;
        })]
    });
            
    if(stage!=="all"){  //filter the corresponding stage and highlight it
      let features:L.GeoJSON={} as L.GeoJSON,result:any[]=[],arr:any[]=[];
      layers.map((layer:OverlayLayer) => {
        arr=[];
        features=layer.features["_layers" as keyof object];
        Object.keys(features).map((key:string) => {  
          if(removeAccents(features[key as keyof object]["feature"]["properties"]["name"] as string).includes(stage)) 
            arr.push(features[key as keyof object]);
        }) 
        if(arr.length>0) result.push({layer:layer.name,features:arr});    
      });

      result[0]?.features.map((feature:L.GeoJSON) => {
        let str:string=feature["feature" as keyof object]["properties" as keyof object]["name" as keyof object];
        feature.bindPopup(`<span class="popup highlight">${str}</span>`
        );
        feature.openPopup();
      });
    }
    
    const layerControl = L.control.layers({"<span style='font-size:1.3rem'>OpenStreetMap</span>": osm});  
    layers.map((layer) => {
      layerControl.addOverlay(layer.features,`<span style='font-size:1.3rem'>${layer.name}</span>`)
    });   
    layerControl.addTo(map);

    return map;
  }

  initLayers(data:object):OverlayLayer[] {
    // layers and features
    const layers:OverlayLayer[]=[];
    (data["layers" as keyof object] as Array<any>).map((layer) => {
      layers.push({name:layer._umap_options.name,features:L.geoJSON(layer.features as Feature[],
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
    return layers;
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
}
