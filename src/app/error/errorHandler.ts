import { Injectable,ErrorHandler,Injector } from "@angular/core";
import { ToastService } from '../../services/toast.service';

@Injectable()

export class GenericErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) {}

    handleError(error: any): void {
        let msg="";
        switch (error.status) {
            case 500:
                msg="Unknown";
                break;
            case 400:
                msg="Server";
                break;
            case 401:
            case 403:
                msg="Authentication";
                break;
            case 404:
                break;
            default:
                msg="Unexpected";
                if(error.name.includes("TypeError")) return; //transient errors triggered during api data loading
        }
        this.injector.get(ToastService).toastError(`${msg} error ${error.status!==undefined?error.status:""} has occured : ${error.message} !`);   
        console.error(new Date()+" : ","status : "+error.status, error.name,error.message);
    }
}