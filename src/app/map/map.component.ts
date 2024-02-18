import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { UmapService } from '../../services/map/umap.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {
  private map:L.Map={} as L.Map;

  constructor(private umap:UmapService) {}
  
  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    //base layer
    const osm=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: this.umap.zoom+2,
      minZoom: this.umap.zoom-4,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    // overlay layers
    const layers=this.umap.getLayers();

    this.map = L.map("map", {
      center: this.umap.center as L.LatLngExpression,
      zoom: this.umap.zoom,
      layers: [osm,...layers.map((layer) => {
        return layer.features;
      })]
    });
    
    const layerControl = L.control.layers({"<span style='font-size:1.3rem'>OpenStreetMap</span>": osm}).addTo(this.map);  
    layers.map((layer) => {
      layerControl.addOverlay(layer.features,`<span style='font-size:1.3rem'>${layer.name}</span>`)
    })  
    
  }
}
