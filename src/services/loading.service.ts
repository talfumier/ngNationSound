import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'platform' //root > platform in order to ensure that 'app' and 'loading' both share the same service instance
})
export class LoadingService {

  setLoadingStatus(status:boolean){
    const elt=document.getElementById("splashScreen");
    if(status) elt?.classList.remove("hidden");
    else elt?.classList.add("hidden");
  }
}
