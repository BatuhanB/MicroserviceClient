export class BasketModel {
    userId: string;
    discountCode: string | null;
    basketItems: BasketItemModel[];
    totalPrice: number;
}

export class BasketItemModel {
    quantity: number;
    courseId: string;
    courseName: string;
    price: number;
}