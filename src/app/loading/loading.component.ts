import { Component } from '@angular/core';
import { environment } from '../../config/environment';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  private _local:boolean=false;

  constructor(){
    this._local=environment.apiMode==="local"?true:false;
  }
  get local() {
    return this._local;
  }
}
