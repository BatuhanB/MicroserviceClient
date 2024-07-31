import { AddressModel } from './addressmodel';
import { OrderItemsModel } from './orderitemsmodel';
export class CreateOrderModel{
    address:AddressModel;
    buyerId:string;
    orderItems:OrderItemsModel[];
}