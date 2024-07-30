import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  isLinear = true;

  constructor(private fb: FormBuilder) {}
  
  adressFormGroup = this.fb.group({
    province: ['', [Validators.required,Validators.minLength(2)]],
    district: ['', [Validators.required,Validators.minLength(3)]],
    street: ['', [Validators.required,Validators.minLength(3)]],
    zipCode: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(5)]],
    line: ['', [Validators.required,Validators.minLength(3)]],
  });

  paymentInfoFormGroup = this.fb.group({
    cardName: ['', [Validators.required,Validators.minLength(3)]],
    cardNumber: ['', [Validators.required,Validators.minLength(12)]],
    expiration: ['', [Validators.required,Validators.pattern('^(0[1-9]|1[0-2])\/\d{2}$')]],
    cvv: ['', [Validators.required,Validators.minLength(3)]],
  });

}
