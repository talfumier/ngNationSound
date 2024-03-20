import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'  // single instance for the entire application
})
export class ToastService {

  constructor(private toastrService: ToastrService) { }

  toastSuccess(msg:string){
    this.toastrService.success(msg);
  }
  toastError(msg:string){
    this.toastrService.error(msg);
  }
}
