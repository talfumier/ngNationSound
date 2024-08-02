import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { DataService } from '../services/data/data.service';

@Injectable()
export class GenericErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private dataService: DataService) {}

  handleError(error: any): void {
    if (!error) return;
    if (error.message && error.message === 'expected') return;
    if (error.name) {
      // HTTP request errors handled in the http.interceptor.ts
      if (error.name === 'TypeError') return; //transient errors pending api data loading is complete
      this.injector
        .get(ToastService)
        .toastError(`An unexpected error has occured ${error.name} !`);
      console.log(new Date(), error);
      this.dataService.displayLoading(false);
    }
  }
}
