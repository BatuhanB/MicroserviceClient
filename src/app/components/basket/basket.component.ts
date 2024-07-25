import { BasketModel } from '../../models/Basket/basketmodel';
import { BasketService } from './../../services/basket.service';
import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../services/identity-service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {

  basketModel: BasketModel;

  constructor(
    private basketService: BasketService,
    private identityService: IdentityService) { }

  ngOnInit(): void {
    let authStatus = false;
    this.identityService.getAuthStatus().subscribe(response => authStatus = response);
    if(authStatus) this.get();
  }

  get() {
    this.basketService.get().subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.basketModel = response.data;
        }
      }
    });
  }
}