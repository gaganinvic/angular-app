import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

export abstract class CrudService<T = any> {

    protected constructor(protected http: HttpClient) {}

    public async get<G>(url): Promise<G | null> {
        let response = null;
        try {
            response = await this.http
                .get<G>(`${environment.apiUrl}/${url}`)
                .toPromise();
        } catch (error) {
          console.log("Error in Get new : ", error)
          throw(error.error || error.message || error.statusText)
        }
        return response;
    }

    public async post(url, body): Promise<any> {
        let response = null;
        try {
            response = await this.http
                .post(`${environment.apiUrl}/${url}`, body)
                .toPromise();
        } catch (error) {
            console.log("Error in POST new : ", error)
            throw(error.error || error.message || error.statusText)
        }
        return response;
    }

    public async put(url, body): Promise<any> {
      let response = null;
      try {
          response = await this.http
              .put(`${environment.apiUrl}/${url}`, body)
              .toPromise();
      } catch (error) {
        console.log("Error in PUT new : ", error)
        throw(error.error || error.message || error.statusText)
      }
      return response;
    }

    public async delete(url): Promise<any> {
        let response = null;
        try {
            response = await this.http
                .delete(`${environment.apiUrl}/${url}`)
                .toPromise();
        } catch (error) {
          console.log("Error in DELETE new : ", error)
          throw(error.error || error.message || error.statusText)
        }
        return response;
    }

}
