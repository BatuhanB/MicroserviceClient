import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-result',
  templateUrl: './checkout-result.component.html',
  styleUrl: './checkout-result.component.css'
})
export class CheckoutResultComponent implements OnInit {
  orderId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next:param=>{
        if(param['orderId']){
          this.orderId = param['orderId'];
        }
      }
    })
  }


}
