import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DataService } from '../../services/data.service';
import { Artist } from '../../services/interfaces';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent{
  private _artist:Artist={} as Artist;
  private _backToText:string="";
  private _backToUrl:string="/";

  constructor(private route: ActivatedRoute,service:DataService){
    const id = this.route.snapshot.paramMap.get("id"),from=this.route.snapshot.paramMap.get("from");
    if(!id || !from) return;
    this._artist=service.getArtistById(parseInt(id));
    switch(from){
      case "program":
        this._backToText="accueil";
        // this._backToOptions.queryParam=from;  
        break;
      case "program-details":        
        this._backToText="programme";
        this._backToUrl="/program";
    }
  }
  get artist():Artist{
    return this._artist;
  }
  get backToText():string{
    return this._backToText;
  }
  get backToUrl(){
    return this._backToUrl;
  }
}
