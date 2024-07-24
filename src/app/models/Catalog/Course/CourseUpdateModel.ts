import { FeatureViewModel } from "./FeatureViewModel";

export class CourseUpdateModel{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    userId: string | null;
    feature: FeatureViewModel = new FeatureViewModel();
    categoryId: string;
}