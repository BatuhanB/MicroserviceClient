import { IdentityService } from './../app/services/identity-service';
import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { mergeMap, Observable } from 'rxjs';

@Injectable()
export class ClientCredentialTokenInterceptor implements HttpInterceptor {
    constructor(private identityService: IdentityService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/catalog')) {
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

    private addToken(request: HttpRequest<any>, token: string): HttpRequest < any > {
    console.log(token);

    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
}
}
