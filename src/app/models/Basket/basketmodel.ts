export interface BasketModel {
    userId: string;
    discountCode: string | null;
    basketItems: BasketItemModel[];
    totalPrice: number;
}

export interface BasketItemModel {
    quantity: number;
    courseId: string;
    courseName: string;
    price: number;
}