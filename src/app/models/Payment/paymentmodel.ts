import { CreateOrderModel } from "../Order/createordermodel";

export class PaymentModel{
    cardName:string;
    cardNumber:string;
    expiration:string;
    cvv:string;
    totalPrice:number;
}

export class PaymentModelAsync{
    cardName:string;
    cardNumber:string;
    expiration:string;
    cvv:string;
    totalPrice:number;
    order:CreateOrderModel;
}