import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormatterNotSt',
  standalone:true
})
export class DurationFormatterPipe implements PipeTransform {

  transform(value:any): string {
    let time:string = '';
    let hour = Math.floor(value / 60);
    let min:number = value % 60;
    
    if(min > 0){
      time = `${hour} hour ${min} min`;
    }else{
      time = `${hour} hour`;
    }
    return time;
  }
}
