import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Loadingodule } from './loading/loading.module';


const platform=platformBrowserDynamic(); //same platform injector for both apps

platform.bootstrapModule(AppModule)
  .catch(err => console.error(err));
platform.bootstrapModule(Loadingodule)
  .catch(err => console.error(err));
