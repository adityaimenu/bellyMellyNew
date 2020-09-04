import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = function() {};
    console.log = console.warn = console.error = () => {};

// Look ma, no error!
    console.error('Something bad happened.');
  }
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
