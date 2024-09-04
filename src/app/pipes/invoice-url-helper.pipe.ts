import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceUrlHelper'
})
export class InvoiceUrlHelperPipe implements PipeTransform {

  private baseUrl:string = "http://localhost:5026";
  transform(url:string):string {
    return this.baseUrl + url ;
  }
}