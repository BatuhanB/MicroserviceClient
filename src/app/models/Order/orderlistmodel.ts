import { AddressModel } from "./addressmodel";
import { OrderItemsModel } from "./orderitemsmodel";

export class OrderListModel{
    id:number; 
    createdDate:Date; 
    //address:AdressModel; 
    buyerId:string; 
    orderItems:OrderItemsModel[];
}