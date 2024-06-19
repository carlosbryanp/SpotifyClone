import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '00:00';

    const minutes: number = Math.floor(value / 60000);
    const seconds: number = Math.floor((value % 60000) / 1000);

    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
