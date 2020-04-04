import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CrudService } from './crud.service';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CrudService {

  token: string;
  redirectUrl: string;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(http: HttpClient) { 
    super(http);
    this.token = localStorage.getItem('AUTH_TOKEN') || '';
  }

  public async login(username: string, password: string) {
    try {
        const response = await this.post('oauth/token', { username, password });
        console.log("login response : ", response)
        console.log("login this.redirectUrl : ", this.redirectUrl)
        this.token = response.token;
        console.log("login this.token : ", this.token)
        localStorage.setItem('AUTH_TOKEN', this.token);
        localStorage.setItem('USERNAME', username);
        this.isLoginSubject.next(true);
        return this.redirectUrl || '';
    } catch (error) {
        console.error('Error during login request', error);
        return Promise.reject(error);
    }
  }

  public getToken(): string {
    return this.token;
  }

  public logout() {
      this.token = '';
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('USERNAME');
      this.isLoginSubject.next(false);
  }

  private hasToken() : boolean {
    return !!localStorage.getItem('AUTH_TOKEN');
  }

  isLoggedIn() : Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  public async register(username: string, password: string, email: string) {
    try {
        const user = await this.post('user', { username, password, email });
        return user;
    } catch (error) {
        console.error('Error during register request', error);
        return Promise.reject(error);
    }
  }

}
