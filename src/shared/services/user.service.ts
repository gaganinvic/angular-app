import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CrudService } from './crud.service';
import { BehaviorSubject, Observable } from "rxjs";
import { IUserPhotos } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService {

  constructor(http: HttpClient) { 
    super(http);
  }

  public async uploadPhotos(formData) {
    try {
      const username = localStorage.getItem('USERNAME')
      const userPhoto = await this.post(`user/${username}/photos`, formData);
      return userPhoto;
    } catch (error) {
        console.error('Error during upload Photos request', error);
        return Promise.reject(error);
    }
  }

  public async getPhotos() {
    try {
      const username = localStorage.getItem('USERNAME')
      const userPhotos: IUserPhotos = await this.get<IUserPhotos>(`user/${username}/photos`);
      return userPhotos.photos;
    } catch (error) {
        console.error('Error during get Photos request', error);
        return Promise.reject(error);
    }
  }

  public async updatePhotos(id:string, body:any) {
    try {
      const username = localStorage.getItem('USERNAME')
      const userPhoto = await this.put(`user/${username}/photos/${id}`, body);
      return userPhoto;
    } catch (error) {
        console.error('Error during get Photos request', error);
        return Promise.reject(error);
    }
  }

  public async deletePhotos(id:string) {
    try {
      const username = localStorage.getItem('USERNAME')
      const userPhoto = await this.delete(`user/${username}/photos/${id}`);
      return userPhoto;
    } catch (error) {
        console.error('Error during get Photos request', error);
        return Promise.reject(error);
    }
  }

}
