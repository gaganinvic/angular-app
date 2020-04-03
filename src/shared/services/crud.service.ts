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
            response = this.errorHandler('GET', url ,error);
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
            response = this.errorHandler('POST', url , error);
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
            response = this.errorHandler('DELETE', url , error);
        }
        return response;
    }

    public errorHandler(
        method: string,
        error: HttpErrorResponse,
        url: string
    ): Promise<never> {
        console.error(
            `Error occurred during ${method} ${environment.apiUrl}/${url}`,
            error
        );
        return Promise.reject(error);
    }
}
