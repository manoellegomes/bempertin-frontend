import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private api = environment.url;
  private idUser = sessionStorage["idUser"] || 4;

  constructor(private httpClient: HttpClient) {}

  postRegister(data): Observable<any> {
    return this.httpClient.post(`${this.api}/register`, data);
  }

  postLogin(data): Observable<any> {
    return this.httpClient.post(`${this.api}/login`, data);
  }

  updateProfile(data): Observable<any> {
    return this.httpClient.put(`${this.api}/users/${this.idUser}`, data);
  }

  getProfile(data): Observable<any> {
    return this.httpClient.get(`${this.api}/users/${this.idUser}`);
  }
}
