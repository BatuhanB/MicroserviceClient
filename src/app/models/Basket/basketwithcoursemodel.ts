import { Feature } from "../Catalog/Course/CourseViewModel";

export class BasketWithCourseModel{
    name: string;
    description: string;
    price: number;
    priceWithDiscount: number;
    image: string;
    userId: string;
    feature: Feature;
    categoryId: string;
    id: string;
    createdDate: string;
}