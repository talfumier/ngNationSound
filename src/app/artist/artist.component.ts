import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {DataService } from '../../services/data/data.service';
import { Artist } from '../../services/interfaces';
import { environment } from '../../config/environment';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent implements OnInit, OnDestroy{
  private sub:Subscription={} as Subscription;
  private id:any="";
  private _artist:Artist={} as Artist;

  constructor(private route: ActivatedRoute,private dataService:DataService,private apiService:ApiService){
    this.id = this.route.snapshot.paramMap.get("id");
    if(!this.id) return;
  }
  ngOnInit(): void {
    window.scrollTo(0,0);

    if(environment.apiMode!=="local" && !this.dataService.data.artists.ready) { //retrieve data from API back end > artists data are required in program page (should already be available from the home page api data loading)      
      document.getElementById("splashScreen")?.classList.remove("hidden");
        const cols=["dates","artists","messages","transports","faqs","partners","pois","events","newsletters"]; //page reload case > full api data reload required
        this.sub=forkJoin(cols.map((col:string) => {
          return this.apiService.getApiObs(col);
        })).subscribe((data) => {
          data.map((item,idx) => {
            this.apiService.formatApiData(cols[idx],item);
          }); 
          this.initData();    
          document.getElementById("splashScreen")?.classList.add("hidden");
        });
    }
    else this.initData();  
  }
  initData(){    
    this._artist=this.dataService.getArtistById(parseInt(this.id));    
  }
  ngOnDestroy(): void {
    if(Object.keys(this.sub).length>0) this.sub.unsubscribe(); //unsubscribe to prevent memory leaks
  }
  get artist():Artist{
    return this._artist;
  }  
  getArtistPath(artist:Artist){
    return environment.apiMode==="local"?('assets/images/artists/' + artist.filename):artist.image;
  }  
}
