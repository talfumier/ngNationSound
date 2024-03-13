import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import config from '../../../config/config.json';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // single instance for the entire application
})
export class ApiService {

  constructor(private http: HttpClient) { }
  
  getApiObs(col:string):Observable<any>{
    return this.http.get(`${config.api_url}/${col}?acf_format=standard&_fields=id,title,acf&per_page=100`);
  }  
}
