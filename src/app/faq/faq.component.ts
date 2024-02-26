import { Component,Input } from '@angular/core';
import { Faq } from '../../services/interfaces';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  @Input() data:Faq={} as Faq;
  
  get faq() {
    return this.data;
  }

}
