import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent, EditDialog} from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import {UploadPhotoComponent} from './uploadPhoto/uploadPhoto.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {CustomMaterial} from '../shared/modules/custom-material/custom-material';

import { ErrorInterceptor } from '../shared/interceptors/error.interceptor';
import { JwtInterceptor } from '../shared/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EditDialog,
    SidenavComponent,
    UploadPhotoComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterial
  ],
  entryComponents: [
    EditDialog
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
