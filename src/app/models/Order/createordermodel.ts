import { AdressModel } from './adressmodel';
import { OrderItemsModel } from './orderitemsmodel';
export class CreateOrderModel{
    adress:AdressModel;
    buyerId:string;
    orderItems:OrderItemsModel[] = [];
}