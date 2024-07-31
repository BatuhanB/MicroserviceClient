import { BasketService } from './../../services/basket.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BasketModel } from '../../models/Basket/basketmodel';
import { BasketWithCourseModel } from '../../models/Basket/basketwithcoursemodel';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  isLinear = true;
  cardNumberRegex = new RegExp(/^\d{4} \d{4} \d{4} \d{4}$/);
  expirationRegex = new RegExp(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
  basket: BasketModel;
  basketWithCourses:BasketWithCourseModel[];

  constructor(
    private fb: FormBuilder,
    private basketService: BasketService
  ) {
    this.basket = new BasketModel();
  }

  ngOnInit(): void {
    this.loadBasket();
  }

  addressFormGroup = this.fb.group({
    province: ['', [Validators.required, Validators.minLength(2)]],
    district: ['', [Validators.required, Validators.minLength(3)]],
    street: ['', [Validators.required, Validators.minLength(3)]],
    zipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    line: ['', [Validators.required, Validators.minLength(3)]],
  });

  paymentInfoFormGroup = this.fb.group({
    cardName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.minLength(19), Validators.maxLength(19), Validators.pattern(this.cardNumberRegex)]],
    expiration: ['', [Validators.required, Validators.pattern(this.expirationRegex)]],
    cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
  });

  loadBasket() {
    this.basketService.get().subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.basket = response.data;
          this.basketWithCourses = this.basketService.mapBasketItemsToCourses(this.basketWithCourses, this.basket.basketItems);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.paymentInfoFormGroup.valid) {
      const cardNumber = this.paymentInfoFormGroup.value.cardNumber.replace(/\s+/g, '');
      console.log('Form Submitted', { ...this.paymentInfoFormGroup.value, cardNumber });
    }
  }

  getCardNumberChunks(): string[] {
    const cardNumber = this.paymentInfoFormGroup.get('cardNumber')?.value || '0000 0000 0000 0000';
    return cardNumber ? cardNumber.split(' ') : [];
  }

  getExpirationDate(): string {
    return `${this.paymentInfoFormGroup.get('expiration').value.slice(0, 2)} / ${this.paymentInfoFormGroup.get('expiration').value.slice(2, 4)}`;
  }
}
