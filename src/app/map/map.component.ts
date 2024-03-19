import { Component, OnDestroy, OnInit,ViewChild,ElementRef} from '@angular/core';
import { Subscription, concatMap, forkJoin, switchMap,map ,tap, of} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { UmapService } from '../../services/map/umap.service';
import { DataService } from './../../services/data/data.service';
import { environment } from '../../config/environment';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit,OnDestroy { 
  private sub:Subscription={} as Subscription;
  private map:L.Map={} as L.Map;
  private stage:any="";
  private _isFullScreen:boolean=false;

  @ViewChild('screenTooltip') tooltip: ElementRef={} as ElementRef;

  constructor(private route:ActivatedRoute,private dataService:DataService,private apiService:ApiService,private umap:UmapService) {
    this.stage = this.route.snapshot.paramMap.get("stage"); 
    if(!this.stage) return;  
  }  
  
  ngOnInit(): void {
    window.scrollTo(0,0);
    document.getElementById("header-map-link")?.classList.add("active"); 
    
    if(environment.apiMode!=="local" && !this.dataService.data.umap_pois.ready) {//retrieve data from API back end
      if(!this.dataService.data.events.ready) { //page reload case > full api data reload required
        const cols=["artists","messages","transports","faqs","partners","pois","events"];
        forkJoin(cols.map((col:string) => {
          return this.apiService.getApiObs(col);
        })).subscribe((data) => {
          data.map((item,idx) => {
            this.apiService.formatApiData(cols[idx],item);
          }); 
        });
      }
      this.apiService.getApiObs("umap_pois").subscribe((data) => {
        this.apiService.formatApiData("umap_pois",data,true);
        this.apiService.getApiObs("umap_pois",this.dataService.data.umap_pois.url).subscribe((data) => {
          this.apiService.formatApiData("umap_pois",data,false);
          this.map=this.umap.initMap(this.dataService.data.umap_pois.data,this.stage); 
        });
      });
    }
    else this.map=this.umap.initMap(this.dataService.data.umap_pois.data,this.stage); //api data already initialized or local data
  }
  ngOnDestroy(): void {
    document.getElementById("header-map-link")?.classList.remove("active");

    if(Object.keys(this.sub).length>0) this.sub.unsubscribe();
  }
  handleFullScreen(evt:Event){
    this._isFullScreen=!this._isFullScreen;
  }
  get isFullScreen(){
    return this._isFullScreen;
  }
  handleMouseEvent(cs:number) {
    this.tooltip.nativeElement.classList.replace(`${cs===1?"hidden":"visible"}`,`${cs===1?"visible":"hidden"}`);
  }
}
