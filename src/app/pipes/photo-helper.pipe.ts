import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photoHelper',
  standalone: true
})
export class PhotoHelperPipe implements PipeTransform {

  transform(url:string): string {
    const baseUrl = 'http://localhost:5020/photos/';
    url = baseUrl + url;
    return url;
  }
}
