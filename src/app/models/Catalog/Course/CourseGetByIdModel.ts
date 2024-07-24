import { Feature } from "./CourseViewModel"

export interface CourseGetByIdModel {
    name: string;
    description: string;
    price: number;
    image: string;
    userId: string;
    feature: Feature;
    categoryId: string;
    id: string;
    createdDate: string;
}