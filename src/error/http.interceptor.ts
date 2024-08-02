import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError, of, Subscription, tap } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { ApiService } from '../services/data/init/api.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject(ApiService);
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((err) => {
      throw of([]).subscribe(() => {
        if (checkNoNetworkConnection(err))
          window.alert('Connection internet ou réseau non disponible !');
        else
          translateTextAndToast(
            `Erreur ${err.status}: ${err.message}`,
            apiService,
            toastService
          );
      });
    }),
    tap((event) => {
      //catching successful responses from API (200 status) returning BadRequest, Unauthorized... custom expected 'errors'
      if (!(event instanceof HttpResponse)) return;
      if (event.url?.includes('tickets')) return;
      if (
        event['body' as keyof object]['statusCode' as keyof object] !==
          'unknown' &&
        event['body' as keyof object]['statusCode' as keyof object] != 200
      ) {
        translateTextAndToast(
          `${event['body' as keyof object]['message' as keyof object]} ${
            event['body' as keyof object]['description' as keyof object]
          }`,
          apiService,
          toastService
        );
        throw Error('expected');
      }
    })
  );
};
function checkNoNetworkConnection(error: any): boolean {
  return (
    error instanceof HttpErrorResponse &&
    !error.headers.keys().length &&
    !error.ok &&
    !error.status &&
    !error.error.loaded &&
    !error.error.total
  );
}
function translateTextAndToast(
  text: string,
  apiService: any,
  toastService: any
) {
  const sub = apiService
    .postApiObs(
      {
        text,
        to: 'fr',
      },
      '/translate'
    )
    .subscribe((data: string) => {
      toastService.toastError(data['text' as keyof object]);
      sub.unsubscribe();
    });
}
