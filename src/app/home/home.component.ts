import { Component, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../config/environment';
import { DataService } from '../../services/data/data.service';
import { Infos, Faq, Message, Artist} from '../../services/interfaces';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,AfterViewInit,OnDestroy {  
  private sub:Subscription={} as Subscription;
  private _slideConfig:any;
  private _artists:Artist[]=[];
  private _messages:Message[]=[];
  private _innerHTML:string[]=[];
  private _infos:Infos={} as Infos;
  private _faqs:Faq[]=[];
  private _partners:any[]=[];
  static scrollY:number;
  
  constructor(private dataService:DataService,private apiService:ApiService,private router: Router) {
    this._artists=dataService.artists;
    this._messages=dataService.messages;
    dataService.initInnerHTML();
    this._innerHTML=dataService.innerHTML;
    this._infos=dataService.infos;
    this._faqs=dataService.faqs;
    this._partners=dataService.partners;
  }

  ngOnInit(): void { 
    document.getElementById("home-link")?.classList.add("active");

    this._slideConfig= {
      "autoplay":true,
      "autoplaySpeed":2500,
      "pauseOnHover":true,    
      "arrows":true,
      "infinite":true,  
      "slidesToShow":3,
      "slidesToScroll":1,   
      "responsive":[
        {
          "breakpoint": 600,
          "settings":{
            "slidesToShow":1,
            "slidesToScroll":1,
          }
        },
        {
          "breakpoint": 968,
          "settings":{
            "slidesToShow":2,
            "slidesToScroll":1,
          }
        },
        
      ],    
    };       
  }
  ngAfterViewInit(): void {    
    if(environment.apiMode!=="local" && !this.dataService.data.umap_pois["ready" as keyof object]) //retrieve umap_pois data from API back end
      this.sub=this.apiService.getApiObs("umap_pois",this.dataService.data.umap_pois["url" as keyof object]).subscribe((data) => {
          this.dataService.data.umap_pois={...this.dataService.data.umap_pois,data,ready:true};
        })

    setTimeout(() => {
      window.scrollTo(0,HomeComponent.scrollY);     
    },100);     
  }
  ngOnDestroy(): void {      
    document.getElementById("home-link")?.classList.remove("active");
    HomeComponent.scrollY=window.scrollY; // record scroll position to be able to return at the same position
    
    if(Object.keys(this.sub).length>0) this.sub.unsubscribe();
  }  
  get slideConfig(){
    return this._slideConfig;
  }
  get artists() {
    return this._artists;
  }
  get messages(){
    return this._messages;    
  }
  get innerHTML():string[]{
    return this._innerHTML;
  }
  get infos() {
    return this._infos;
  }
  get faqs(){
    return this._faqs;
  }
  get partners(){
    return this._partners;
  }
  getArtistPath(artist:Artist){
    return environment.apiMode==="local"?('assets/images/artists/' + artist.filename):artist.image;
  }
  getPartnerPath(idx:number){
    return environment.apiMode==="local"?`assets/images/partners/${this._partners[idx]}`:this._partners[idx].image;    
  }

  @HostListener("click", ['$event']) // prevent page reload when launching an anchor link
  onClick(event: MouseEvent) {
    if (event.target instanceof HTMLAnchorElement === false)  
      return;   
    event.preventDefault(); // Prevent page from reloading
    const target = <HTMLAnchorElement>event.target;
    this.router.navigate([target.pathname]);
  }
}