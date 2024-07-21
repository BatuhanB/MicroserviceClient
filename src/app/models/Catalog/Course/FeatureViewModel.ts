
export class FeatureViewModel {
    duration: number;

    constructor() {
        this.duration = 0;
    }

    toJSON(): string {
        return JSON.stringify({ duration: this.duration });
    }
}
