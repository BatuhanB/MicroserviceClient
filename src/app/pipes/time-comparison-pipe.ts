import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeComparison',
})
export class TimeComparisonPipe implements PipeTransform {

    transform(inputDate: Date): string {
        const currentDate = new Date();

        const timeDiff = currentDate.getTime() - new Date(inputDate).getTime();
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }
    }
}
