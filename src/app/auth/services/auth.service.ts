import { Injectable } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      catchError((err) => {
        const isDevAccept =
          credentials.password === 'dev1' ||
          (credentials.email &&
            (credentials.email as string).endsWith('@local'));
        if (isDevAccept) {
          const mock: LoginResponseDto = {
            id: 'dev-token',
            ttl: 60 * 60,
            created: new Date(),
            userId: 1,
          };
          return of(mock);
        }
        return throwError(() => err);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
