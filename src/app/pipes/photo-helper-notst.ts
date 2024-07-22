import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'photoHelperNotSt',
})
export class PhotoHelperNotStPipe implements PipeTransform {

    transform(url: string): string {
        if (url.includes('http')) {
            return url;
        }
        const baseUrl = 'http://localhost:5020/photos/';
        url = baseUrl + url;
        return url;
    }
}
