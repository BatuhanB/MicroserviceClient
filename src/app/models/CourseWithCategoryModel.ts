import CategoryViewModel from "./CategoryViewModel";
import { FeatureViewModel } from "./FeatureViewModel";

export interface CourseWithCategoryViewModel {
    id: string;
    createdDate: string;
    price: number;
    image: string | null;
    userId: string | null;
    feature: FeatureViewModel | null;
    categoryId: string;
    category: CategoryViewModel | null;
}

