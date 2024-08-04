import { IdentityService } from './../services/identity-service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private identityService: IdentityService
    ) { }

    canActivate(): boolean {
        const authToken = this.identityService.isAuthenticated();
        if (authToken) {
            return true;
        } else {
            this.router.navigate(['/sign-in']);
            return false;
        }
    }
}
