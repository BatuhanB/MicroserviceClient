import { Router } from '@angular/router';
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
  private identityUrl = 'http://localhost:5004'; // replace with your identity server URL
  private clientId = 'FrontEndClientWithResource';
  private clientSecret = 'secret';
  private clientCredentialId = 'FrontEndClient';
  private authStatus = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.checkAuthToken();
  }

  getUserId(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.sub : null;
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private checkAuthToken(): void {
    const authToken = this.getAccessToken();
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
          this.storeTokens(token, false);
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
    return this.cookieService.get('refresh_token');
  }

  public storeTokens(token: TokenResponse, isRemember: boolean): void {
    const refreshTokenDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    console.log(refreshTokenDate);
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: true,
      expires: refreshTokenDate
    };
    // if isRemember true set expDate to refresh token
    this.cookieService.delete('refresh_token');
    this.cookieService.set('refresh_token', token.refresh_token, cookieOptions);
    this.setAccessToken(token.access_token, token.expires_in,isRemember);
  }

  setAccessToken(token: string, expiresIn: number = 0, isRemember: boolean = false) {
    const accessTokenDate = new Date(new Date().getTime() + expiresIn * 1000);
    console.log(accessTokenDate);
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: true,
      expires: isRemember ? accessTokenDate : undefined
    };
    this.cookieService.set("access_token", token, cookieOptions);
  }

  getAccessToken(): string | null {
    var token = this.cookieService.get("access_token");
    return token ? token : null;
  }

  logout(): void {
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: true,
    };
    this.cookieService.delete('refresh_token', cookieOptions['path']);
    this.cookieService.delete('access_token', cookieOptions['path']);
    localStorage.removeItem('user_name');
    this.updateAuthStatus(false);
    this.router.navigateByUrl['/sign-in'];
  }

  getUserProfile(): Observable<UserInfo> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserInfo>(`${this.identityUrl}/connect/userinfo`, {
      headers,
    });
  }
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isAuthenticatedAsync(): Observable<boolean> {
    const token = this.getAccessToken();
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
