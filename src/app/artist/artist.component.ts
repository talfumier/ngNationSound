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
  private _backToOptions:{url:string,queryParam:string}={url:"/",queryParam:""};

  constructor(private route: ActivatedRoute,service:DataService){
    const id = this.route.snapshot.paramMap.get("id"),from=this.route.snapshot.paramMap.get("from");
    if(!id || !from) return;
    this._artist=service.getArtistById(parseInt(id));
    switch(from){
      case "program":
        this._backToText="accueil > concerts 2024";
        this._backToOptions.queryParam=from;
        break;
    }
  }
  get artist():Artist{
    return this._artist;
  }
  get backToText():string{
    return this._backToText;
  }
  get backToOptions(){
    return this._backToOptions;
  }

}
