import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appExpirationDate]'
})
export class ExpirationDateDirective {
    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event'])
    onInputChange(event: KeyboardEvent): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.substr(0, 4);
        }
        const formattedValue = value.replace(/(\d{2})(\d{2})/, '$1/$2');
        input.value = formattedValue;
    }
}
