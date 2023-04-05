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
export class UserService {
  course_url: string = environment.API_URL_COURSE; 
  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<any> {
    return this.http.get(this.course_url + 'getall');
  }

  getCourseByTech(tech : string): Observable<any> {
    return this.http.get(this.course_url + 'info/' + tech,);
  }

  getCourseByDuration(tech: string, from?: number, to?: number): Observable<any> {
    console.log(tech, from, to);
    return this.http.get(this.course_url + 'get/' + from + '/' + to + "/" + tech);
  }

  addCourse(name: any, description: any, duration: any, technology: any, launchURL: any): Observable<any> {
    return this.http.post(this.course_url + 'add', {
      name,
      description,
      duration,
      technology,
      launchURL
    }, httpOptions);
  }

  deleteCourse(id: any): Observable<any> {
    return this.http.delete(this.course_url + 'delete' + "/" + id);
  }
}
