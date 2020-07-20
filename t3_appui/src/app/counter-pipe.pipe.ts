import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'counterPipe'
})
export class CounterPipePipe implements PipeTransform {

  transform(value: number): string {
    const parts = ['k', 'm', 'b', 't'];
    if (value > 1000) {
      const rounded = Math.round(value);
      const formatted = rounded.toLocaleString('en');
      const arrayFormat = formatted.split(',');
      const count = arrayFormat.length - 1;
      let display = arrayFormat[0] + (parseInt(arrayFormat[1][0], 10) !== 0 ? '.' + arrayFormat[1][0] : '');
      display += parts[count - 1];
      return display;
    }
    return value.toString();
  }

}
