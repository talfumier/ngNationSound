import { ErrorHandler } from "@angular/core";

export class GenericErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        console.error("xxxx",error);
    }
}