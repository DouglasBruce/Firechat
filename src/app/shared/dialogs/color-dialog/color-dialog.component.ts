import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-color-dialog',
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.scss']
})
export class ColorDialogComponent implements OnInit {

    chosenColor: string;

    constructor(private dialogRef: MatDialogRef<ColorDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private afs: AngularFirestore) {}

    ngOnInit() {
        this.chosenColor = this.data.color;
    }

    changeColor(color: string) {
      this.chosenColor = color;
      this.afs.collection('users').doc(this.data.uid).update({
          color: color
      });
      this.closeDialog();
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
