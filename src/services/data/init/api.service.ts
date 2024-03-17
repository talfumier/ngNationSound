import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, catchError} from 'rxjs';
import _ from 'lodash';
import config from '../../../config/config.json';
import { DataService } from '../data.service';
import { Transport } from '../../interfaces';
import { ToastService } from '../../toast.service';

@Injectable({
  providedIn: 'root' // single instance for the entire application
})
export class ApiService {

  constructor(private http: HttpClient,private service:DataService,private toastService:ToastService) { }
  
  getApiObs(col:string,url?:string):Observable<any>{
    if(!url) url=`${config.api_url}/${col}?acf_format=standard&_fields=id,title,acf&per_page=100`;
    return this.http.get(url).pipe(
      catchError((error) => {
        let msg="";
        if (error.status === 0) {
          msg="A client-side or network error occurred !";
          console.log("Client side error occurred :", error.error);
        } else {
          msg="API backend returned an unsuccessful response code "+error.status+" ! Please retry later."
          console.log(new Date,error.status,error.error);
        }
        throw this.toastService.toastError(msg);
      })
    );
  }
  formatApiData(col:string,data:any){
    switch(col){
      case "messages":
        this.service.data.messages=data.map((msg:any) => {
          return msg.acf;
        });
        break;
      case "dates":
        this.service.data.dates={start_date:new Date(data[0].acf.start_date),end_date:new Date(data[0].acf.end_date)};
        this.service.data.infos={
          opening:data[0].acf.opening_hours,street:data[0].acf.street,city:data[0].acf.city,
          lat:data[0].acf.lat,lng:data[0].acf.lng,transport:this.service.data.infos.transport
        }
        break;
      case "pois":
      case "artists":
      case "partners":
        this.service.data[col]=data.map((item:any) => {
          if(item.acf.image) item.acf.image=item.acf.image.url;
          return {id:item.id,...item.acf};
        });
        break;
      case "transports":
        this.service.data.infos.transport={car:[],train:[],plane:[]};
        _.sortBy(data,"title.rendered","asc").map((item:any) => {
          this.service.data.infos.transport[item.acf.transport_mean as keyof Transport].push(item.acf.description);
        });
        break;
      case "faqs":
        this.service.data[col]=data.map((item:any) => {
          return {...item.acf};
        })
        break;
      case "tickets":
        this.service.data.passes=data.map((item:any) => {
          return {
            category:item.acf.category,
            pass1:item.acf.price_1day,
            pass2:item.acf.price_2days,                
            pass3:item.acf.price_3days
          };
        });
        break; 
      case "events":       
        this.service.data[col]=data.map((item:any) => {
          if(item.acf.image) item.acf.image=item.acf.image.url;
          return {...item.acf,performer:item.acf.performer[0],location:item.acf.location[0]};
        });  
        break;      
      case "umap_pois": 
        this.service.data[col]={url:data[0].acf.umap_json.url,data:{},ready:false};
    }
  } 
}

