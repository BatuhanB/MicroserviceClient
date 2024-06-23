// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private cookieService: CookieService) { }

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
