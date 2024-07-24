import { IdentityService } from './../services/identity-service';
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private cookieService: CookieService,
        private identityService: IdentityService
    ) { }

    canActivate(): boolean {
        const authToken =
            this.cookieService.get('authToken') ||
            sessionStorage.getItem('authToken') ||
            localStorage.getItem('access_token');
        if (authToken) {
            return true;
        } else {
            this.router.navigate(['/sign-in']);
            return false;
        }
    }
}
