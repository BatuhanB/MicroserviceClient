import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, mergeMap } from 'rxjs/operators';
import { IdentityService } from '../app/services/identity-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    constructor(private identityService: IdentityService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isApiUrl(req.url)) {
            const accessToken = this.identityService.getAccessToken();
            if (accessToken) {
                req = this.addToken(req, accessToken);
            }

            return next.handle(req).pipe(
                catchError((error) => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        return this.handle401Error(req, next);
                    } else {
                        return throwError(error);
                    }
                })
            );
        } else if (this.isClientCredentialUrl(req.url)) {
            return this.identityService.getClientCredentialToken().pipe(
                mergeMap(token => {
                    const cloned = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token.access_token}`
                        }
                    });
                    return next.handle(cloned);
                })
            );
        }
        return next.handle(req);
    }

    private isApiUrl(url: string): boolean {
        return (
            url.includes(':5004') ||
            url.includes('/basket') ||
            url.includes('/discount') ||
            url.includes('/order') ||
            url.includes('/fakepayment') ||
            url.includes('/notification') ||
            url.includes('/invoice')
        );
    }

    private isClientCredentialUrl(url: string): boolean {
        return (
            url.includes('/catalog') ||
            url.includes('/photostock')
        );
    }

    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.identityService.getAccessTokenByRefreshToken().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token.access_token);
                    return next.handle(this.addToken(request, token.access_token));
                }),
                catchError((err) => {
                    this.isRefreshing = false;
                    this.identityService.logout();
                    return throwError(err);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((jwt) => {
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }
    }
}
