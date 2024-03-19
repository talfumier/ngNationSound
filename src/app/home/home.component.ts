import { Component, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import { forkJoin} from 'rxjs';
import _ from 'lodash';
import { environment } from '../../config/environment';
import config from '../../config/config.json';
import { DataService } from '../../services/data/data.service';
import { Infos, Faq, Message, Artist, Model } from '../../services/interfaces';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,OnDestroy {
  private _artists:Artist[]=[];
  private _messages:Message[]=[];
  private _innerHTML:string[]=[];
  private _infos:Infos={} as Infos;
  private _faqs:Faq[]=[];
  private _partners:any[]=[];
  static scrollY:number;
  
  constructor(private dataService:DataService,private apiService:ApiService,private router: Router) {    
  }

  ngOnInit(): void { 
    document.getElementById("home-link")?.classList.add("active");
    
    const cols=["artists","messages","transports","faqs","partners","pois","events"];   //dates api data uploaded in the header component    
    const ready=cols.map((key:string) => {
      return this.dataService.data[(key!=="transports"?key:"infos") as keyof Model].ready
    });
    if(environment.apiMode!=="local" && ready.indexOf(false)!==-1)
      forkJoin(cols.map((col:string) => {
        return this.apiService.getApiObs(col);
      })).subscribe((data) => {
        data.map((item,idx) => {
          this.apiService.formatApiData(cols[idx],item);
        });
        this.initData();
      });
    else this.initData();  //api data already initialized or local data      
  }
  initData(){
    this._artists=this.dataService.artists;
    this._messages=this.dataService.messages;
    this.dataService.initInnerHTML();
    this._innerHTML=this.dataService.innerHTML;
    this._infos=this.dataService.infos;
    this._faqs=this.dataService.faqs;
    this._partners=this.dataService.partners;
  }
  ngOnDestroy(): void {      
    document.getElementById("home-link")?.classList.remove("active");
    HomeComponent.scrollY=window.scrollY; // record scroll position to be able to return at the same position
  }  
  get slideConfig(){
    return config.carouselConfig;
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