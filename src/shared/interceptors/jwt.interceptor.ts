import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
    const token: string = this.authService.getToken();
    if (token) {
        request = request.clone({
            setHeaders: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`//,
            }
        });
    }

    return next.handle(request);
  }
}