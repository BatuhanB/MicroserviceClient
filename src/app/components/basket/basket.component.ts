import { AuthGuard } from './../../guards/auth.guard';
import { BasketModel } from '../../models/Basket/basketmodel';
import { BasketService } from './../../services/basket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {

  basketModel: BasketModel = new BasketModel();

  constructor(
    private basketService: BasketService,
    private auth: AuthGuard) { }

  ngOnInit(): void {
    if(this.auth.canActivate()){
      this.get();
    }
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