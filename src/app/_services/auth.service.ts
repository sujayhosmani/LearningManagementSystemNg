import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth_url:string = environment.API_URL_AUTH;
  constructor(private http: HttpClient) { }

  login(emailId: string, password: string): Observable<any> {
    return this.http.post(this.auth_url + 'login', {
      emailId,
      password
    }, httpOptions);
  }

  register(name: string, emailId: string, password: string): Observable<any> {
    return this.http.post(this.auth_url + 'register', {
      name,
      emailId,
      password
    }, httpOptions);
  }
}
