import { FeatureViewModel } from "./FeatureViewModel";

export class CourseCreateModel {
    name: string;
    description: string;
    price: number;
    image: string;
    userId: string;
    feature: FeatureViewModel;
    categoryId: string;

    constructor() {
        this.categoryId = '';
        this.name = '';
        this.description = '';
        this.price = 0;
        this.image = '';
        this.feature = new FeatureViewModel();
        this.userId = '';
    }
}