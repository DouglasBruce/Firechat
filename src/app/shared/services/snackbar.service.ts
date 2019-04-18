import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

    constructor(public snackBar: MatSnackBar) {}

    error() {
        this.openSnackbar("A problem occurred. Please try again later");
    }
    
    openSnackbar(message: string): void {
        this.snackBar.open(message, null, {
            duration: 2000,
            direction: 'ltr',
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
        });
    }
}
