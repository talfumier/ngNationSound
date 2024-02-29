import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import * as L from 'leaflet';
import '@bepo65/leaflet.fullscreen';
import { UmapService } from '../../services/map/umap.service';
import { OverlayLayer } from '../../services/interfaces';
import { removeAccents } from '../utilities/functions/utlityFunctions';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  private map:L.Map={} as L.Map;
  private layers:OverlayLayer[]=[];
  private stage:any="";

  constructor(private route:ActivatedRoute,private umap:UmapService) {
    this.stage = this.route.snapshot.paramMap.get("stage"); 
    if(!this.stage) return;
  }  
  
  ngOnInit(): void {
    window.scrollTo(0,0);
    document.getElementById("header-map-link")?.classList.add("active");
    this.initMap();    
  }
  ngOnDestroy(): void {
    document.getElementById("header-map-link")?.classList.remove("active");
  }

  private initMap(): void {
    //base layer
    const osm=L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: this.umap.zoom+2,
      minZoom: this.umap.zoom-4,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    
    this.umap.initLayers();
    this.layers=this.umap.layers;
    
    this.map = L.map("map", {
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft',
        title: 'plein écran',
        titleCancel: 'sortir du mode plein écran',
        content:"<img src='assets/icons/map/fullscreen.svg' style='padding:2px;' alt='plein ecran'/>",
        forceSeparateButton: true,
      },      
      center: this.umap.center as L.LatLngExpression,
      zoom: this.umap.zoom,
      layers: [osm,...this.layers.map((layer) => { // base layer + overlay layers
        return layer.features;
        })]
    });
        
    if(this.stage!=="all"){  //filter the corresponding stage and highlight it
      let features:L.GeoJSON={} as L.GeoJSON,result:any[]=[],arr:any[]=[];
      this.layers.map((layer:OverlayLayer) => {
        arr=[];
        features=layer.features["_layers" as keyof object];
        Object.keys(features).map((key:string) => {  
          if(removeAccents(features[key as keyof object]["feature"]["properties"]["name"] as string).includes(this.stage)) 
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
    this.layers.map((layer) => {
      layerControl.addOverlay(layer.features,`<span style='font-size:1.3rem'>${layer.name}</span>`)
    });   
    layerControl.addTo(this.map);
  }
}
