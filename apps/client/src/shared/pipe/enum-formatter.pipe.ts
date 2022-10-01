import {Pipe, PipeTransform} from '@angular/core'
import { NgModule } from '@angular/core'

@Pipe({
    name: 'enumFormatter'
})
export class EnumFormatterPipe implements PipeTransform {

    private titleCase = (word: string) => {
        return word.replace(/(^|\s)\S/g, (text) => {
            return text.toUpperCase()
        })
    }

    transform(value: string): string {
        if (!value) {
            return ''
        }

        return this.titleCase(value.toLowerCase().split('-').join(' '))
    }
}


@NgModule({
  declarations: [EnumFormatterPipe],
  exports: [EnumFormatterPipe],
})
export class EnumFormatterPipeModule {}
