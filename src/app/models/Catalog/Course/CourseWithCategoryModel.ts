import { CategoryModel } from "../Category/CategoryModel";
import { FeatureViewModel } from "./FeatureViewModel";

export interface CourseWithCategoryViewModel {
    id: string;
    name:string;
    description:string;
    createdDate: string;
    price: number;
    image: string | null;
    userId: string | null;
    feature: FeatureViewModel | null;
    categoryId: string;
    category: CategoryModel | null;
}

