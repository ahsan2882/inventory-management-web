import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as Honeybadger from '@honeybadger-io/js';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';

Honeybadger.configure({
  apiKey: 'hbp_U9onvyE25dNwhzvKOHAZeeERupILiY46CNyj',
  environment: 'production',
});

class HoneybadgerErrorHandler implements ErrorHandler {
  handleError(error: { originalError: any }) {
    Honeybadger.notify(error.originalError || error);
  }
}

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, SignupComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: HoneybadgerErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
