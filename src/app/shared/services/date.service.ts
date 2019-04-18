import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

    monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    weekNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    getWeekShortName(d: number) {
        return this.weekNamesShort[d];
    }

    getMonthShortName(m: number) {
        return this.monthNamesShort[m];
    }

    getMonthLongName(m: number) {
        return this.monthNames[m];
    }
}
