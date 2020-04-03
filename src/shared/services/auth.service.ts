import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CrudService {

  token: string;
  redirectUrl: string;

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
  }

  public isLogged(): boolean {
      return this.token.length > 0;
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
