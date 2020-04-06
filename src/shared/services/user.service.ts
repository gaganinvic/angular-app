import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CrudService } from './crud.service';
import { BehaviorSubject, Observable } from "rxjs";
import { IUsers } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService {

  constructor(http: HttpClient) { 
    super(http);
  }

  public async getAllUsers() {
    try {
      const users: IUsers = await this.get<IUsers>(`user`);
      return users.users;
    } catch (error) {
        console.error('Error during get Users request', error);
        return Promise.reject(error);
    }
  }


}
