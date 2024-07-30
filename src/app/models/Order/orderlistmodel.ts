import { AdressModel } from "./adressmodel";
import { OrderItemsModel } from "./orderitemsmodel";

export class OrderListModel{
    id:number; 
    createdDate:Date; 
    //address:AdressModel; 
    buyerId:string; 
    orderItems:OrderItemsModel[];
}