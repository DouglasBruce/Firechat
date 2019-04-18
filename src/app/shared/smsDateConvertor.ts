import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from "./services/date.service";

@Pipe({
  name: 'smsConvertor'
})
export class smsDateConvertorPipe implements PipeTransform {

    constructor(private dateService: DateService) {}

    transform(milli: number, arg1: any): string {
        let dateSent = new Date(milli);
        let dateSentWithNoTime = this.generateDateWithNoTime(dateSent);
        let now = new Date();
        let nowWithNoTime = this.generateDateWithNoTime(now);
        let milliPassed = now.getTime() - dateSent.getTime();
        let minutesPassed = Math.floor(milliPassed / 60000);
        let daysPassed = this.daysBetween(dateSentWithNoTime, nowWithNoTime);

        if(daysPassed == 0) {
            if(minutesPassed < 60) {
                if(minutesPassed == 0) {
                    return 'Now';
                } else {
                    return minutesPassed + ' mins';
                }
            } else {            
                return this.generate12HrTime(dateSent);    
            }
        } else {
            if(daysPassed > 0 && daysPassed <= 7) {
                return this.generateWeekDayPlusTime(dateSent);
            } else if(daysPassed > 7 && daysPassed <= 365) {
                return this.generateShortDate(dateSent.getDate(), dateSent.getMonth(), dateSent);
            } else {
                return this.generateLongDate(dateSent.getDate(), dateSent.getMonth(), dateSent.getFullYear(), dateSent);
            }
        }
    }

    generateDateWithNoTime(date: Date): Date {
        let date_str = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        return new Date(date_str);
    }

    generate12HrTime(date: Date) {
        let mins = date.getMinutes();
        let mins_str: string;
        let hour = date.getHours();
        let postfix = 'am'
        if(mins < 10) {
            mins_str = "0" + mins;
        } else {
            mins_str = mins.toString();
        }
        if(hour > 12) {
            hour = hour - 12;
            postfix = 'pm'
        }
        return hour + ':' + mins_str + ' ' + postfix;
    }

    generateWeekDayPlusTime(dateSent: Date) {
        return this.dateService.getWeekShortName(dateSent.getDay()) + ' ' + this.generate12HrTime(dateSent);
    }

    generateShortDate(d: string | number, m: number, dateSent: Date) {
        return this.dateService.getMonthShortName(m) + ' ' + d + ', ' + this.generate12HrTime(dateSent);
    }

    generateLongDate(d: string | number, m: number, y: string | number, dateSent: Date) {
        return d + '/' + (m + 1) + '/' + y.toString().substr(2,2) + ' ' + this.generate12HrTime(dateSent);
    }

    daysBetween(d1: Date, d2: Date){ 
        return this.toDays(this.toUTC(d2) - this.toUTC(d1)); 
    }

    toUTC(d: { getFullYear: () => number; getMonth: () => number; getDate: () => number; }) { 
        if(!d || !d.getFullYear)return 0; 
        return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());
    }

    toDays(d: number) {
        d = d || 0;
        return d / 24 / 60 / 60 / 1000;
    }
}