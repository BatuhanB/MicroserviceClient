import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appCardNumber]'
})
export class CardNumberDirective {
    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event'])
    onInputChange(event: KeyboardEvent): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 16) {
            value = value.substr(0, 16);
        }
        const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        input.value = formattedValue;
    }
}
