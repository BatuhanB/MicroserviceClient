import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface SignInModel {
  email: string;
  password: string;
  isRemember: boolean;
}

export interface UserInfo {
  email: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  sub: string;
}

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private identityUrl = 'https://localhost:5004'; // replace with your identity server URL
  private clientId = 'FrontEndClientWithResource';
  private clientSecret = 'secret';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAccessTokenByRefreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('refresh_token', refreshToken)
      .set('grant_type', 'refresh_token');

    return this.http
      .post<TokenResponse>(`${this.identityUrl}/connect/token`, body)
      .pipe(
        map((token) => {
          this.storeTokens(token);
          return token;
        })
      );
  }

  signIn(credentials: {
    email: string;
    password: string;
    isRemember: boolean;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('client_id', 'FrontEndClientWithResource')
      .set('client_secret', 'secret')
      .set('grant_type', 'password')
      .set('username', credentials.email)
      .set('password', credentials.password);

    return this.http.post(
      `${this.identityUrl}/connect/token`,
      body.toString(),
      { headers }
    );
  }

  private getRefreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  private storeTokens(token: TokenResponse): void {
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
    localStorage.setItem(
      'expires_in',
      new Date().getTime() + token.expires_in * 1000 + ''
    );
  }

  getAccessToken(): string {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    this.cookieService.delete('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('user_name');
  }

  getUserProfile(): Observable<UserInfo> {
    const token = this.getBearerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserInfo>(`${this.identityUrl}/connect/userinfo`, {
      headers,
    });
  }

  private getBearerToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getUserName(): string {
    return localStorage.getItem('user_name');
  }
}
