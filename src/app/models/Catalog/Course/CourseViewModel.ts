export interface CourseViewModel {
    name: string
    description: string
    price: number
    image: string
    userId: string
    feature: Feature
    category: Category
    id: string
    createdDate: string
}

export interface Feature {
    duration: number
}

export interface Category {
    name: string
    id: string
    createdDate: string
}
