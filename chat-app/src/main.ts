import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideRouter} from "@angular/router";
import {routes} from "./app/app.routes";
import {provideServiceWorker} from '@angular/service-worker';
import {importProvidersFrom, isDevMode} from '@angular/core';
import {provideStore} from '@ngrx/store';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from "@angular/common/http";
import {provideFirebaseApp, initializeApp} from "@angular/fire/app";
import {provideMessaging, getMessaging} from "@angular/fire/messaging";
import {environment} from "./environments/environment";

bootstrapApplication(AppComponent, {
  providers:
    [
      provideRouter(routes),
      provideHttpClient(),
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
      }),
      provideStore(),
      provideAnimationsAsync(),
      importProvidersFrom(
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideMessaging(() => getMessaging())
      ),
    ]
})
  .catch((err) => console.error(err));
