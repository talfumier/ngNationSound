import { Component} from '@angular/core';
import { setDefaultOptions} from 'date-fns'
import { fr } from 'date-fns/locale';
setDefaultOptions({ locale: fr })

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ngNationSound';
}
