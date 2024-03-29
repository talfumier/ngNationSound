import { Injectable,ErrorHandler,Injector } from "@angular/core";
import { ToastService } from '../services/toast.service';
import { environment } from "../config/environment";
import { DataService } from "../services/data/data.service";

@Injectable()

export class GenericErrorHandler implements ErrorHandler {

    constructor(private injector: Injector,private dataService:DataService) {}

    handleError(error:any): void { 
        if(error && error.name){// Filter out HTTP request errors (handled in the api service) 
            if(environment.apiMode!=="local" && error.name==="TypeError") return; //transient errors pending api data loading is complete
            this.injector.get(ToastService).toastError(`An unexpected error has occured ${error.name} !`);   
            console.log(new Date(),error);
            this.dataService.displayLoading(false);
        }
    }
}