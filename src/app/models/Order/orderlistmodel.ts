import { AddressModel } from "./addressmodel";
import { OrderItemsModel } from "./orderitemsmodel";

export class OrderListModel{
    id:number; 
    createdDate:Date; 
    address:AddressModel; 
    buyerId:string; 
    orderItems:OrderItemsModel[];
}

export class OrderListModelForOrderHistoryPage{
    id:number; 
    createdDate:Date; 
    address:AddressModel; 
    buyerId:string; 
    invoiceFileUrl:string; 
    orderItems:OrderItemsModel[];
}