export class BasketModel {
    userId: string = null;
    discountCode: string = null;
    discountRate: number = 0;
    basketItems: BasketItemModel[] = [];
    totalPrice: number = 0;
    totalPriceWithDiscount: number = 0;
}

export class BasketItemModel {
    quantity: number;
    courseId: string;
    courseName: string;
    price: number;
    priceWithDiscount: number;
}