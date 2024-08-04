import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  private clientCredentialId = 'FrontEndClient';
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService
  ) {
    this.checkAuthToken();
  }

  getUserId(): string | null {
    const token = this.cookieService.get('access_token');
    if (!token) return null;
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.sub : null;
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private checkAuthToken(): void {
    const authToken =
      this.cookieService.get('access_token') ||
      sessionStorage.getItem('access_token');
    const isAuthenticated = !!authToken;
    this.authStatus.next(isAuthenticated);
  }

  updateAuthStatus(isAuthenticated: boolean): void {
    this.authStatus.next(isAuthenticated);
  }

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
          this.storeTokens(token, true);
          return token;
        })
      );
  }

  getClientCredentialToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('client_id', this.clientCredentialId)
      .set('client_secret', this.clientSecret)
      .set('grant_type', 'client_credentials');

    return this.http.post(
      `${this.identityUrl}/connect/token`,
      body.toString(),
      { headers }
    );
  }

  signIn(credentials: SignInModel): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('grant_type', 'password')
      .set('username', credentials.email)
      .set('password', credentials.password);

    return this.http.post<TokenResponse>(
      `${this.identityUrl}/connect/token`,
      body.toString(),
      { headers }
    ).pipe(
      map((token) => {
        this.storeTokens(token, credentials.isRemember);
        return token;
      })
    );
  }

  private getRefreshToken(): string | null {
    return this.cookieService.get('refresh_token') || localStorage.getItem('refresh_token');
  }

  public storeTokens(token: TokenResponse, isRemember: boolean): void {
    const expDate = new Date(new Date().getTime() + 10000);
    console.log(expDate);

    const accessTokenExpiration = ((token.expires_in / 60) / 60) / 24; // Convert seconds to days
    if (isRemember) {
      this.cookieService.set('access_token', token.access_token, expDate);
      this.cookieService.set('refresh_token', token.refresh_token);
    } else {
      sessionStorage.setItem('access_token', token.access_token);
      localStorage.setItem('refresh_token', token.refresh_token);
    }
  }

  getAccessToken(): string | null {
    return this.cookieService.get('access_token') || sessionStorage.getItem('access_token');
  }

  logout(): void {
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    this.updateAuthStatus(false);
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
    return this.cookieService.get('access_token') || sessionStorage.getItem('access_token') || '';
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get('access_token') || !!sessionStorage.getItem('access_token');
  }

  isAuthenticatedAsync(): Observable<boolean> {
    const token = this.cookieService.get('access_token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return of(true);
    } else {
      return of(false);
    }
  }

  getUserName(): string {
    return localStorage.getItem('user_name');
  }
}
