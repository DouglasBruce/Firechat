import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

    colorArray = [
        'purple',
        'pink',
        'red',
        'green',
        'orange',
        'yellow',
        'blue'
    ]

    randomColor() {
        var randomNumber = Math.floor(Math.random() * this.colorArray.length);
        return this.colorArray[randomNumber];
    }
}
