import { IdentityService } from './../services/identity-service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private identityService: IdentityService
    ) { }

    canActivate(): Observable<boolean> {
        return this.identityService.isAuthenticatedAsync().pipe(
            switchMap(isAuthenticated => {
                if (isAuthenticated) {
                    return of(true);
                } else {
                    return this.identityService.getAccessTokenByRefreshToken().pipe(
                        map(token => {
                            if (token) {
                                this.identityService.storeTokens(token,true);
                                return true;
                            } else {
                                this.router.navigate(['/sign-in']);
                                return false;
                            }
                        }),
                        catchError(() => {
                            this.router.navigate(['/sign-in']);
                            return of(false);
                        })
                    );
                }
            })
        );
    }
}
