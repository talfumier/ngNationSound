import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/data/init/api.service';
import { DataService } from './../../services/data/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private _value: string = '';

  constructor(
    private toastService: ToastService,
    private dataService: DataService,
    private apiService: ApiService
  ) {}
  get value() {
    return this._value;
  }
  set value(data) {
    this._value = data;
  }

  submit(form: NgForm) {
    if (!form.valid) {
      this.toastService.toastError(
        'Veuillez saisir une adresse email valide !'
      );
      return;
    }
    const email = form.value.newsletter.email;
    this.apiService
      .postApiObs({ email }, '/entities/newsletter-subscription')
      .subscribe((res) => {
        this.toastService.toastSuccess(
          'Votre formulaire de contact a été transmis avec succès !'
        );
        this.dataService.data.newsletters.data.push({ email });
      });
  }
}
