import { CardInformationService } from './../../services/card-information.service';
import { CardInformation } from './../../models/User/CardInformation';
import { AddressModel } from './../../models/User/AddressModel';
import { AddressService } from './../../services/address.service';
import { IdentityService } from './../../services/identity-service';
import { Router } from '@angular/router';
import { CheckoutModel, CheckoutModelAsync } from './../../models/Order/checkoutmodel';
import { OrderService } from './../../services/order.service';
import { BasketService } from './../../services/basket.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BasketModel } from '../../models/Basket/basketmodel';
import { BasketWithCourseModel } from '../../models/Basket/basketwithcoursemodel';
import { CreateOrderModel } from '../../models/Order/createordermodel';

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
  basketWithCourses: BasketWithCourseModel[];
  addresses: AddressModel[] = [];
  cardInformations: CardInformation[] = [];

  constructor(
    private fb: FormBuilder,
    private basketService: BasketService,
    private orderService: OrderService,
    private router: Router,
    private identityService: IdentityService,
    private addressService: AddressService,
    private cardInformationService:CardInformationService
  ) {
    this.basket = new BasketModel();
  }

  ngOnInit(): void {
    this.getUserAdresses();
    this.getUserCardInformations();
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

  getUserCardInformations() {
    const userId = this.identityService.getUserId();
    this.cardInformationService.getByUserId(userId).subscribe({
      next: response => {
        this.cardInformations = response.data
      }
    })
  }

  getUserAdresses() {
    const userId = this.identityService.getUserId();
    this.addressService.getByUserId(userId).subscribe({
      next: response => {
        this.addresses = response.data
      }
    })
  }

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
    if (this.addressFormGroup.valid && this.paymentInfoFormGroup.valid) {
      let checkout: CheckoutModel = new CheckoutModel();
      checkout = this.mapAddressModel(checkout);
      checkout = this.mapPaymentModel(checkout);
      this.orderService.create(checkout, () => { }).subscribe({
        next: response => {
          if (response.isSuccessful) {
            this.addressFormGroup.reset();
            this.paymentInfoFormGroup.reset();
            this.basketService.delete().subscribe({ next: res => res });
            if (response.data) {
              this.router.navigateByUrl(`/checkout/result/${response.data.orderId}`);
            }
          }
        }
      });
    }
  }

  onSubmitAsync(): void {
    if (this.addressFormGroup.valid && this.paymentInfoFormGroup.valid) {
      let checkout: CheckoutModelAsync = new CheckoutModelAsync();
      checkout = this.mapAddressModelAsync(checkout);
      checkout = this.mapPaymentModelAsync(checkout);
      this.orderService.suspendCreate(checkout, () => { }).subscribe({
        next: response => {
          if (response.isSuccessful) {
            this.addressFormGroup.reset();
            this.paymentInfoFormGroup.reset();
            this.basketService.delete().subscribe({ next: res => res });
            this.router.navigateByUrl(`/checkout/result/`);
          }
        }
      })
    }
  }

  mapAddressModelAsync(checkout: CheckoutModelAsync): CheckoutModelAsync {
    checkout.address = {
      district: this.addressFormGroup.get('district').value,
      province: this.addressFormGroup.get('province').value,
      line: this.addressFormGroup.get('line').value,
      street: this.addressFormGroup.get('street').value,
      zipCode: this.addressFormGroup.get('zipCode').value
    };
    return checkout;
  }

  mapPaymentModelAsync(checkout: CheckoutModelAsync): CheckoutModelAsync {
    const cardNumber = this.paymentInfoFormGroup.value.cardNumber.replace(/\s+/g, '');
    checkout.payment = {
      cardName: this.paymentInfoFormGroup.get('cardName').value,
      cardNumber: cardNumber,
      cvv: this.paymentInfoFormGroup.get('cvv').value,
      expiration: this.paymentInfoFormGroup.get('expiration').value,
      totalPrice: 0,
      order: new CreateOrderModel()
    };
    return checkout;
  }

  mapAddressModel(checkout: CheckoutModel): CheckoutModel {
    checkout.address = {
      district: this.addressFormGroup.get('district').value,
      province: this.addressFormGroup.get('province').value,
      line: this.addressFormGroup.get('line').value,
      street: this.addressFormGroup.get('street').value,
      zipCode: this.addressFormGroup.get('zipCode').value
    };
    return checkout;
  }

  mapSelectedAddressToAddressForm(address: AddressModel) {
      this.addressFormGroup.setValue({
        district:address.district,
        province:address.province,
        line:address.line,
        street:address.street,
        zipCode:address.zipCode,
      });
  }

  mapSelectedCardInformationToCardInformationForm(cardInformation: CardInformation) {
      this.paymentInfoFormGroup.setValue({
        cardName:cardInformation.cardName,
        cardNumber:cardInformation.cardNumber,
        expiration:cardInformation.expiration,
        cvv:null
      });
  }

  mapPaymentModel(checkout: CheckoutModel): CheckoutModel {
    const cardNumber = this.paymentInfoFormGroup.value.cardNumber.replace(/\s+/g, '');
    checkout.payment = {
      cardName: this.paymentInfoFormGroup.get('cardName').value,
      cardNumber: cardNumber,
      cvv: this.paymentInfoFormGroup.get('cvv').value,
      expiration: this.paymentInfoFormGroup.get('expiration').value,
      totalPrice: 0
    };
    return checkout;
  }

  getCardNumberChunks(): string[] {
    const cardNumber = this.paymentInfoFormGroup.get('cardNumber')?.value || '0000 0000 0000 0000';
    return cardNumber ? cardNumber.split(' ') : [];
  }

  getExpirationDate(): string {
    return `${this.paymentInfoFormGroup.get('expiration').value.slice(0, 2)} / ${this.paymentInfoFormGroup.get('expiration').value.slice(2, 4)}`;
  }
}
