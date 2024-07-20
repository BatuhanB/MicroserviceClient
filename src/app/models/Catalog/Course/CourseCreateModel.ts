import { FeatureViewModel } from "./FeatureViewModel";
import {CategoryModel} from "../Category/CategoryModel"

export class CourseCreateModel {
    name:string;
    description: string;
    price: number;
    image: string | null;
    userId: string | null;
    feature: FeatureViewModel | null;
    categoryId: string;
    category: CategoryModel | null;
}