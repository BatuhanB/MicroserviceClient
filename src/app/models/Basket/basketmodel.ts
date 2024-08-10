export class BasketModel {
    userId: string = null;
    discountCode: string = null;
    discountRate: number = 0;
    basketItems: BasketItemModel[] = [];
    totalPrice: number = 0;
    totalPriceWithDiscount: number = 0;

    getTotalPrice():number{
        return this.totalPriceWithDiscount > 0 ? this.totalPriceWithDiscount : this.totalPrice; 
    }
}

export class BasketItemModel {
    quantity: number;
    courseId: string;
    courseName: string;
    courseOwnerId: string;
    price: number;
    priceWithDiscount: number;

    getPrice():number{
        return this.priceWithDiscount > 0 ? this.priceWithDiscount : this.price; 
    }
}