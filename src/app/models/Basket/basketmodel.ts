export class BasketModel {
    userId: string = null;
    discountCode: string = null;
    basketItems: BasketItemModel[] = [];
    totalPrice: number = 0;
}

export class BasketItemModel {
    quantity: number;
    courseId: string;
    courseName: string;
    price: number;
}