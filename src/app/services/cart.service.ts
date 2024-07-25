import { Injectable } from '@angular/core';
import { BasketModel } from '../models/Basket/basketmodel';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  basket:BasketModel;
  constructor() { }

  addToCart(item:any){
    this.basket.basketItems.push(item);
    localStorage.setItem("basket",JSON.stringify(this.basket));
  }

  removeFromCart(item:string){
    var newArr = this.basket.basketItems.filter((elem)=> elem.courseId != item);
    this.basket.basketItems = newArr;
    localStorage.setItem("basket",JSON.stringify(this.basket));
  }
}
